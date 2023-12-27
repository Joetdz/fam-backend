const { transporter } = require('../services/email')

const saveAbonnement = async (userId, userEntity, myPayement) => {
  const { planName } = myPayement
  console.log('Planeme ', planName)
  try {
    const userExit = await userEntity.findOne({
      _id: { $eq: userId },
    })
    if (!userExit) {
      throw new Error('Utilisateur introuvable')
    }

    const savePayement = await userEntity.update(
      { _id: { $eq: userId } },
      { $push: { abonnements: myPayement } }
    )
    if (!savePayement) {
      throw new Error("impossible d'enregistrer le paiement")
    }
    const from = `FanFrame <contact@fanframe.co>`
    const to = userExit.email
    const subject = `Confirmation de paiement - Abonnement FanFrame.co `
    const text = `Cher(e)  ${userExit.name}`
    const html = `<h2 style="color: black;">Cher(e)  ${userExit.name}</h2>
<p style="color: black;">Merci pour votre confiance ! Votre paiement pour l'abonnement <a href="https://fanframe.co/">FanFrame.co<a/> a bien été reçu.</p>
<p style="color: black;">Détails de la transaction :</p>
<ul style="color: black;">
  <li>Plan : <strong style="color: black;">${planName}</strong></li>
  <li>Durée : <strong style="color: black;">1 mois</strong></li>
  <li>Prix : <strong><span style="color: black;">$${
    (planName === 'Basic' && '9$') ||
    (planName === 'Standard' && '29$') ||
    (planName === 'Premium' && '99$')
  }</span></strong></li>
</ul>  <p style="color: black;">Votre abonnement est désormais actif. Profitez pleinement de votre expérience sur FanFrame.co.
Si vous avez des questions, n’hésitez pas à nous contacter à ${
      process.env.EMAIL_FROM
    }.
<br/>

Bien à vous,<p/>
<strong style="color: black;">L'équipe <strong/> <a href="https://fanframe.co/">FanFrame.co<a/><br/>
<center>
<img src="https://www.fanframe.co/_next/image?url=%2Fassets%2Ffanframe.png&w=128&q=75" alt="Logo FanFrame.co">
</center>
`
    if (userExit.email) {
      const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
      }
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.log(err)
      })
    }

    return {
      sucessPayment: 'paiement sauvegarder avec succès',
      error: null,
    }
  } catch (error) {
    return {
      sucessPayment: null,
      error: error,
    }
  }
}
module.exports = { saveAbonnement }
