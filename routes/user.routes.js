const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller.js');
const verifyToken = require('../middlewares/auth.middleware.js').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware.js').verifyRoles;

router.get('/', verifyToken, userController.findAll);
router.get('/:username', userController.findOne);
// router.post('/', userController.create);
router.post('/', verifyToken, verifyRoles("ADMIN"), userController.create);
router.patch('/:username', verifyToken, verifyRoles("ADMIN"),userController.update);
router.delete('/:username', verifyToken, verifyRoles("ADMIN"),userController.deleteByUsename);
router.delete('/"username/email/:email', verifyToken, verifyRoles("ADMIN"), userController.deleteByEmail);

module.exports = router;