const nodemailer = require('nodemailer')

const sendEmail = async options => {
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
   user:`${process.env.EMAIL}`,
   pass: `${process.env.PASSWORD}`,
  },
 })

 const message = {
  from: `${process.env.EMAIL}`,
  to: options.email,
  subject: options.subject,
  text: options.message,
 }

 transporter.sendMail(message, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


}
module.exports=sendEmail