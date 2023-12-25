const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_USE_SSL == "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const sendCreateFrameMail = async (user) => {
  if (!user.email) return
  console.log(transporter.options)
  transporter.sendMail(
    {
      from: '"FanFrame" <infos.fanframe.co>',
      to: user.email,
      subject: 'Enregistrement de votre frame',
      html: `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enregistrement de votre frame</title>
    </head>
    <body>
      <table>
        <tbody>
          <tr>
            <td>Cher ${user.name},</td>
          </tr>
          <tr>
            <td><br></td>
          </tr>
          <tr>
            <td>
              Nous sommes ravis de vous informer que votre frame a été créée avec succès sur notre plateforme! Vous pouvez maintenant inviter vos fans à utiliser votre frame pour personnaliser leurs photos de profil.
            </td>
          </tr>
          <tr>
            <td>
              <P>Voici comment partager votre frame avec vos fans :</P>
              <ol>
                <li>Connectez-vous à votre compte sur notre plateforme. <a style="text-decoration: none;" href="https://fanframe.co">fanframe.co</a></li>
                <li>Accédez à la section "Mes frames" et sélectionnez votre frame.</li>
                <li>Cliquez sur le bouton "Partager" pour obtenir le lien direct vers votre frame.</li>
                <li>Utilisez ce lien pour partager votre frame sur vos réseaux sociaux, votre site web ou tout autre canal de communication avec vos fans.</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td>Nous sommes impatients de voir comment vos fans utiliseront votre frame pour montrer leur soutien et leur admiration pour vous !</td>
          </tr>
          <tr>
            <td>
              <br>
              Une question? Une préoccupation? N'hésitez pas à répondre à ce mail.
            </td>
          </tr>
          <tr>
            <td>
              <br>
              Cordialement, l'équipe <a style="text-decoration: none;" href="https://fanframe.co">fanframe.co</a>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
    `,
    },
    (error) => {
      if (error) console.log(error)
    }
  )
}

module.exports = { transporter, sendCreateFrameMail }
