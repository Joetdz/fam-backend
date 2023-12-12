const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: `smtp.hostinger.com`,
  port: 465,
  secure: true,
  auth: {
    user: `admin@fanframe.co`,
    pass: `@FanFrame2023`,
  },
})
module.exports = { transporter }
