const { User } = require('../models/user')
const { saveAbonnement } = require('../utils/payement')
const { transporter } = require('../services/email')

const buyAbonnement = async (req, res) => {
  const { myPayement, userId } = req.body

  try {
    if (!myPayement) {
      throw new Error('Aucun paiement trouvé')
    }
    if (!userId) {
      throw new Error('Aucun user trouvé')
    }

    const savePayement = await saveAbonnement(userId, User, myPayement)

    if (!savePayement) {
      throw new Error('impossible d enregistrer le paiement ')
    }
    res.status(200).json({
      paymentSaved: savePayement,
      error: null,
    })
  } catch (error) {
    res.status(501).json({
      paymentSaved: null,
      error: error,
    })
  }
}
const sendMail = async (req, res) => {
  const { to, subject, text, html } = req.body
  const from = `${process.env.EMAIL_FROM}`
  try {
    if (!to || !subject || !text) {
      throw new Error(
        "Vous devez fournir le destinateire , l'obejt , et le corp du mail"
      )
    }
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
  } catch (error) {
    console.log(error)
  }
}
module.exports = { buyAbonnement, sendMail }
