const express = require('express')
const router = express.Router()

const userControllers = require('../controllers/users.controller')
const userValidate = require('../validate/users.validate')

const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', userControllers.getUser)
router.get('/create_user', userControllers.createUser)
router.post('/create_user', userValidate.validatePostCreateUser , userControllers.postCreateUser)
router.get('/:id', userControllers.getUserId)
router.post('/:id', userControllers.postUserId)
router.get('/:id/delete', userControllers.getUserIdToDelete)

module.exports = router