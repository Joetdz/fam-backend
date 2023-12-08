const express = require('express')
const { createOrLoginUser, getOneUser, getAllUsers } = require('../controllers/user')
const router = express.Router()

router.post('/login', createOrLoginUser)
router.get("/:id", getOneUser);
router.get("/all", getAllUsers);

module.exports = router
