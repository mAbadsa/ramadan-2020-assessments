const express = require('express');
const router = express.Router();

const { getUsers, createUser } = require('../controllers/auth');

router.route('/users').get(getUsers);

router.route('/users/login').post(createUser);

module.exports = router;