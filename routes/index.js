const express = require('express');

const router = express.Router();

const Url = require('../models/Url');

router.get('/', (req, res) => {
	res.redirect('/shorturls/welcome');
});

router.get('/:shortUrl', (req, res) => {
	if (req.params.shortUrl == 'shorturls') {
		res.redirect('/shorturls/welcome');
	} else {
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
	}
});

module.exports = router;
