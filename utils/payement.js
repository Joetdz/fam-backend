const { transporter } = require('../services/email')

const saveAbonnement = async (userId, userEntity, myPayement) => {
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
    const from = `${process.env.EMAIL_FROM}`
    const to = `joeltondozi@gmail.com`
    const subject = ` Confirmation de paiement du plan ${myPayement.planName}`
    const text = `Bonjour ${userExit.name}`
    const html = `<p>Bonjour ${userExit.name}<br/>Nous vous confirmons la réception de votre paiement du plan ${myPayement.planName} sur FanFrame.<br/> <p/>`
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(500).json({ error: err })
      } else {
        res.status(200).json({ success: true, info: info })
      }
    })

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
