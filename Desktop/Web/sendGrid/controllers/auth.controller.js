
const bcrypt = require('bcrypt')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

module.exports.login = (req, res) => {
  res.render('auth/login')
}
module.exports.postLogin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  
  const user = db.get('users').find({email: email}).value()
  
  if(!user){
    res.render('auth/login', {
      errors: [
        'User does not exist.',
      ],
      values: req.body
    })
    return
  }
  
  if(!await bcrypt.compare(password, user.password)){
    res.render('auth/login', {
      errors: [
        'Wrong password'
      ],
      values: req.body
    })
    return 
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'hungtx1001@gmail.com',
    from: 'hungtx1001@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg)

  res.cookie('userId', user.id, {
    signed: true
  })
  res.redirect('/users')
}