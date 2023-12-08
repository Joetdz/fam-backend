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
