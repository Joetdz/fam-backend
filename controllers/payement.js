const { User } = require('../models/user')
const { saveAbonnement } = require('../utils/payement')

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

module.exports = { buyAbonnement }
