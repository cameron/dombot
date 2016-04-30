---
layout: default
---

DOM testing for humans.
<br/>
<br/>

~~~javascript
bot.please('login and land on the dashboard')
   .set('#email', 'test@account.com')
   .set('#password', 'asdfasdf')
   .click('#login')
   .fail('#form-error-login')
   .pass('#dashboard')
~~~

<iframe src="https://ghbtns.com/github-btn.html?user=cameron&amp;repo=dombot&amp;type=watch&amp;count=true&amp;size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="170" height="30"></iframe><br/>

dom.bot wraps [jasmine](http://jasmine.github.io/), which makes it easy to organize your tests into (possibly nested) suites, and provide setup/teardown functions for each test and suite.

~~~javascript
// app.bot.js
import app from 'app';
import bot from 'dom.bot';

export default bot('my app')

.pre(function (ready) {
  this.dom = document.createElement('div');
  app.reset();
  app.render(this.dom, ready);
})

.post(function(){ ... })
~~~

~~~javascript
// profile.test.js
import bot from 'app.bot';

// these tests will each be wrapped by the pre/post defined above
bot.please('change password')
   ...

bot.please('update email')
   ...

bot.please('change profile photo')
   ...
~~~

<br/>
You can also teach your bots common sequences for easy re-use. Let's expand on the example above and teach our bot how to login:

~~~javascript
// app.bot.js
import app from 'app';
import bot from 'dom.bot';

export default bot('my app')

...

.action('login', function() {
  return this.set('#email', 'test@user.com')
             .set('#password', 'tart oyster')
             .click('#login')
             .fail('#form-error-login')
             .pass('#dashboard')
});
~~~

~~~javascript
// profile.test.js
import bot from 'app.bot';

bot.please('change password')
   .login()
   .click('#settings')
   .click('#security')
   ...
~~~

That's it. Stay out of jail.

## Author

Cameron Boehmer [Twitter](http://twitter.com/camron)/[GitHub](http://github.com/cameron)

![Cameron Boehmer](https://www.gravatar.com/avatar/b868d84bbe2ed30ec45c9253e1c1cefe.jpg?s=200)

### License

[MIT License](http://chibicode.mit-license.org/)

<a href="https://github.com/cameron/dombot" class="github-corner"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
