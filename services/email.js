const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  // secure: process.env.SMTP_USE_SSL == "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const sendCreateFrameMail = async (user) => {
  if (!user.email) return
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
            <td>cher(e) ${user.name},</td>
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
      <center>
      <img src="https://www.fanframe.co/_next/image?url=%2Fassets%2Ffanframe.png&w=128&q=75" alt="Logo FanFrame.co">
      </center>
    </body>
    </html>
    `,
    },
    (error) => {
      if (error) console.log(error)
    }
  )
}

const sendPlanFansExpiryMail = async (user, remaining) => {
  if (!user.email) return
  transporter.sendMail(
    {
      from: '"FanFrame" <infos.fanframe.co>',
      to: user.email,
      subject: 'Mise à jour de votre frame pour atteindre plus de fans',
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
            <td>cher(e) ${user.name},</td>
          </tr>
          <tr>
            <td><br></td>
          </tr>
          <tr>
            <td>
              Nous tenons à vous informer que votre frame sur notre plateforme est en train de rencontrer un franc succès et qu'elle approche bientôt du nombre maximum d'utilisations autorisées. Actuellement, il ne reste que ${remaining} utilisations disponibles pour votre frame.
            </td>
          </tr>
          <tr>
            <td>
            <br />
            Si vous souhaitez continuer à permettre à vos fans d'utiliser votre frame et d'étendre votre visibilité, nous vous encourageons à envisager de passer à notre plan premium, qui vous offrira un nombre illimité d'utilisations pour vos frames, ainsi que d'autres fonctionnalités exclusives pour interagir avec votre communauté.</td>
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
      <center>
      <img src="https://www.fanframe.co/_next/image?url=%2Fassets%2Ffanframe.png&w=128&q=75" alt="Logo FanFrame.co">
      </center>
    </body>
    </html>
    `,
    },
    (error) => {
      if (error) console.log(error)
    }
  )
}

const sendExpiredFrameUsedMail = async (user, frame) => {
  if(!user.email) return

  transporter.sendMail(
    {
      from: '"FanFrame" <infos.fanframe.co>',
      to: user.email,
      subject: 'Mise à jour de votre frame pour atteindre plus de fans',
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
            <td>cher(e) ${user.name},</td>
          </tr>
          <tr>
            <td><br></td>
          </tr>
          <tr>
            <td>
              Nous tenons à vous informer que votre frame '${frame.name}' sur notre plateforme a déjà atteint le nombre maximum de fans, mais un fan vient d'essayer de l'utiliser.
            </td>
          </tr>
          <tr>
            <td>
            <br />
            Si vous souhaitez continuer à permettre à vos fans d'utiliser votre frame et d'étendre votre visibilité, nous vous encourageons à envisager de passer à notre plan premium, qui vous offrira un nombre illimité d'utilisations pour vos frames, ainsi que d'autres fonctionnalités exclusives pour interagir avec votre communauté.</td>
          </tr>
          <tr>
            <td>
            <br />
            Si non vous pouvez supprimer la frame dans votre espace profile afin qu'elle ne soit plus visible sur notre plateforme.</td>
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
      <center>
      <img src="https://www.fanframe.co/_next/image?url=%2Fassets%2Ffanframe.png&w=128&q=75" alt="Logo FanFrame.co">
      </center>
    </body>
    </html>
    `,
    },
    (error) => {
      if (error) console.log(error)
    }
  )
}

module.exports = { transporter, sendCreateFrameMail, sendPlanFansExpiryMail, sendExpiredFrameUsedMail }
