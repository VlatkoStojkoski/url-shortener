const express = require('express');
const { ensureAuthenticated } = require('../auth/auth');

const router = express.Router();

const Url = require('../models/Url');

router.get('/welcome', (req, res) => {
	res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
	Url.find({ owner: req.user.id }, (err, urls) => {
		if (err) {
			console.log(err);
		} else {
			res.render('dashboard', { urls });
		}
	});
});

module.exports = router;
