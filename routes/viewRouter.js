const express = require('express');
const router = express.Router();
const viewsController = require('../controller/viewController');
const authController = require('../controller/authController');

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
