const express = require('express');
const shortid = require('shortid');
const { ensureAuthenticated } = require('../auth/auth');

const router = express.Router();

const Url = require('../models/Url');

router.post('/', ensureAuthenticated, (req, res) => {
	let { longUrl, shortUrl } = req.body;

	Url.findOne({ shortUrl }).then((url) => {
		if (url) {
			req.flash('error_msg', 'Short ID already registered');
			res.redirect('/shorturls/dashboard');
		} else {
			if (shortUrl == '') {
				shortUrl = shortid.generate();
			}

			let newUrl = new Url({ longUrl, shortUrl, owner: req.user.id });

			newUrl
				.save()
				.then((url) => {
					req.flash('success_msg', 'Registered short URL successfully');
					res.redirect('/shorturls/dashboard');
				})
				.catch((err) => console.log(err));
		}
	});
});

module.exports = router;
