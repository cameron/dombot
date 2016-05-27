import React from 'react';
import App from 'containers/App';
import AuthActions from 'actions/AuthActions';
import { render, unmountComponentAtNode } from 'react-dom';
import bot from 'lib/dombot';
import * as actions from 'lib/actions';

export default bot('preact')

.pre(function (ready) {
  this.dom = document.createElement('div');
  AuthActions.logout();
  render(<App/>, this.dom, () => setTimeout(ready, 4000));
})

.post(function () {
  unmountComponentAtNode(this.dom);
})

.addActions(actions);
