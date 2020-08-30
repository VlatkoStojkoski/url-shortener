const express = require('express');
const { ensureAuthenticated } = require('../auth');

const router = express.Router();

const Url = require('../models/Url');

router.get('/', (req, res) => {
	res.render('welcome');
});

router.get('/l/:shortUrl', (req, res) => {
	Url.findOne({ shortUrl: req.params.shortUrl }).then((url) => {
		if (url) {
			url.clicks++;
			url
				.save()
				.then(() => res.redirect(url.longUrl))
				.catch((err) => console.log(err));
		} else {
			res.send('Short URL not found');
		}
	});
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
