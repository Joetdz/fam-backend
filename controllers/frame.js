const { User } = require('../models/user')
const { Frame } = require('..//models/frame')
const {
    insertFrame,
    getFramelist,
    poseFrame,
    getSingleFrame,
} = require('../utils/frame')

const createFrame = async(req, res) => {
    const frame = req.body
    try {
        if (!frame.name && !frame.createdBy) {
            throw new Error(
                'Imposible de créer le frame sans le nom et sans être membre'
            )
        }
        let newFrame = null
        newFrame = await insertFrame(frame, Frame, User)
        if (!newFrame.frame) {
            throw new Error(newFrame.error)
        }
        res.status(200).json({
            frame: newFrame.frame,
            message: `Le frame a été  créé avec succès`,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error })
    }
}

const getAllFrames = async(req, res) => {
    const { createdBy } = req.query
    console.log('createdBy', createdBy)
    try {
        let allFrames = []
        const filter = {}
        if (createdBy) {
            filter.createdBy = createdBy
            allFrames = await getFramelist(Frame, filter)
            if (allFrames && allFrames.frames.length == 0) {
                throw new Error('pas de frames crée par cet utilisateur')
            }

            res.status(200).json({
                frames: allFrames.frames,
                messega: 'Tous les frames recupérés avec succès ft',
            })
        } else {
            allFrames = await getFramelist(Frame)
            if (!allFrames) {
                throw new Error('pas de frames crée par cet utilisateur')
            }

            res.status(200).json({
                frames: allFrames,
                messega: 'Tous les frames recupérés avec succès ',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
}

const getOneFrame = async(req, res) => {
    const { id } = req.params
    try {
        let frame = {}
        const filter = {}
        if (id) {
            filter.id = id
            frame = await getSingleFrame(Frame, filter)
            if (!frame) {
                throw new Error('pas de frame trouvé')
            }

            res.status(200).json({
                frame: frame,
                message: 'Frame trouvé',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json(error)
    }
}


const createFanFram = async(req, res) => {
    const { imgUrl, frameUrl } = req.body

    // console.log('url', imgUrl, frameUrl)

    const result = await poseFrame(imgUrl, frameUrl)
    res.status(200).json({
        frames: result,
    })
}

module.exports = { getAllFrames, createFrame, createFanFram, getOneFrame }