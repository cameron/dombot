//  DOM testing for humans

/* global jasmine, describe, it beforeEach, afterEach */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

import { check,
         uncheck,
         pause,
         waitForEl,
         waitForOneOfEls,
         click,
         dispatchEvent,
         setVal } from 'lib/utils';
import _ from 'lodash';
import promise from 'bluebird';
const log = window.console.log.bind(console);


function bot (name) {
  const child = makeBot(name, this);
  this.children.push(child);
  return child;
}


function wrapTaskMethods (methods) {
  return _.mapValues(methods, method => (
    function (...args) {
      // ensure that .fail() is followed by .pass()
      if (_.get(this, 'task.failPendingPass') && method.name != 'pass') {
        throw new Error('fail() must be followed by pass()');
      }

      // pass a reference to the task along to each step
      const nextStep = method.call(this, ...args);
      if (nextStep) {
        nextStep.task = this.task || this; // if this.task is undefined, this is the task
        nextStep.task.lastStep = nextStep; // herp derp memory leaks but its a short-lived process so oh wells
        nextStep.bot = this.bot;
        return nextStep;
      }
    }
  ));
};


const originalThen = promise.prototype.then;
_.assign(promise.prototype, wrapTaskMethods({

  // included just so .then also gets wrapped
  then (...args) {
    return originalThen.call(this, ...args);
  },

  click (sel) {
    return this.then(() => click(this.bot.dom, sel));
  },

  set (sel, val) {
    return this.then(() => setVal(this.bot.dom, sel, val));
  },

  setSelect (sel, val) {
    return this.wait(sel).then(select => {
      _.map(select.querySelectorAll('option'), opt => opt.selected = opt.value === val);
      dispatchEvent(select, 'change');
    });
  },

  fail (...args) {
    this.failPendingPass = args;
    return this;
  },

  check (sel, opts = {}) {
    return this.then(() => check(this.bot.dom, sel, opts));
  },

  uncheck (sel, opts = {}) {
    return this.then(() => uncheck(this.bot.dom, sel, opts));
  },

  pass (passSel, passCond) {
    const [failSel, formatError] = this.failPendingPass || [];
    delete this.failPendingPass;

    return this.then(() => waitForOneOfEls(this.bot.dom, passSel, failSel))
               .spread((passEl, failEl) => {
                 if (failEl) {
                   let errorStr =`Found ${failSel}. `;
                   if (formatError) {
                     errorStr += ' ' + formatError(failEl);
                   }
                   throw new Error(errorStr);
                 }

                 if (passCond && !passCond(passEl)) {
                   throw new Error(`Pass condition for ${passSel} not met.`);
                 }
               });
  },

  wait (sel) {
    return this.then(() => waitForEl(this.bot.dom, sel));
  },

  pause (duration) {
    return this.then(() => pause(duration));
  },

  thanks () {
    // TODO
    // this.catch(...)
  },
}));


function makeTask (name, bot) {
  let tResolve;
  const task = new promise(resolve => tResolve = resolve);
  task.begin = done => { task.lastStep.done(done); tResolve(); };
  task.name = name;
  task.bot = bot;

  return task;
}




// creates a copy of the bot function and assigns a bunch of properties
// both to the function itself and to the object it's bound to, so that the function
// looks basically the same inside during invocation (this.) and out (bot.)
function makeBot (name, parent) {
  const props = _.assign({}, {
    botName: name,
    children: [],
    tasks: [],
    actions: {},
    parent,
  },{

    pre (func) {
      this.preFunc = func;
      return this;
    },

    post (func) {
      this.postFunc = func;
      return this;
    },

    please (taskName) {
      const task = makeTask(taskName, this);
      this.tasks.push(task);
      return task;
    },

    // like jasmine's xit, disables this test
    xplease (...args) {
      const task = this.please(...args);
      this.tasks.pop();
      return task;
    },

    okayGo () {
      // TODO this part of the api is a bit weird -- calling bot.okayGo() anywhere
      // in the bot tree triggers the entire tree of bot/tasks
      if (this.parent) return this.parent.okayGo();

      this._makeJasmineSuite();
    },

    action (name, action) {
      if (promise.prototype[name] !== undefined) {
        throw new Error('The action name ' + name + ' is already in use.');
      }

      this.actions[name] = action;
      return this;
    },

    addActions (actions) {
      // TODO might want to check to see if properties exist before assigning user-defined functions
      _.assign(promise.prototype, wrapTaskMethods(actions));
      return this;
    },

    _makeJasmineSuite () {
      describe(this.botName, () => {
        this.preFunc && beforeEach(this.preFunc.bind(this));
        this.postFunc && afterEach(this.postFunc.bind(this));
        this.tasks.map(task => {
          it(task.name, done => {
            log('>>>>>>>>> ' + task.name);
            task.begin(done);
          });
        });

        this.children.map(bot => bot._makeJasmineSuite());
      });
    },
  });

  // this looks a little funny, but it serves the purpose of building
  // an instance-like object that's callable and can use, e.g., this.children
  // when called to reference the same bot.children accessible on the (exterior
  // of the) function object.
  const child = bot.bind(props);
  _.assign(child, props);

  return child;
}

export default makeBot('dombot');
