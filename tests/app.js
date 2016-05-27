import bot from 'lib/app.bot';
import { newUser, user } from 'lib/data';


bot.please('login and logout')
   .loginAsAdmin()
   .click('#logout')
   .pass('#page-login')
   .thanks();


bot.please('submit the sign up form')
   .click('#sign-up')
   .set('#email', newUser.email)
   .set('#password', newUser.pass)
   .set('#first-name', 'first')
   .set('#last-name', 'last')
   .set('#company', 'test')
   .click('#form-submit-create')
   .fail('#form-error-create', el => el.innerText)
   .pass('#page-dashboard')
   .thanks();


const newPass = user.pass + '-';
bot.please('change password')
   .loginAsUser()
   .click('#settings')
   .click('#security')
   .set('#new-password', newPass)
   .set('#repeat-new-password', newPass)
   .set('#current-password', user.pass)
   .click('#form-submit-changepassword')
   .fail('#form-error-change-password', el => el.innerText)
   .pass('#toast', el => el.innerText.trim() == 'Password Saved')
   .set('#new-password', user.pass)
   .set('#repeat-new-password', user.pass)
   .set('#current-password', newPass)
   .click('#form-submit-changepassword')
   .pass('#toast', el => el.innerText.trim() == 'Password Saved')
   .pause(3000) // the backend has to send an email before the password gets updated :\
   .thanks();


bot.please('invite a new user as an admin')
   .loginAsAdmin()
   .inviteNewUser()
   .thanks();


bot.please('invite a new user as a user')
   .loginAsUser()
   .inviteNewUser()
   .thanks();


bot.please('update the profile name')
   .loginAsUser()
   .click('#settings')
   .click('#profile')
   .set('#first-name', 'updated-first')
   .set('#last-name', 'updated-last')
   .click('#form-submit-update')
   .fail('#form-error-update')
   .pass('#toast')
   .thanks();


bot.okayGo();
