const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
	const { email, password, passconfirm } = req.body;
	let errors = [];

	if (!email || !password || !passconfirm) {
		errors.push({ msg: 'Please fill in all fields' });
	}

	if (password !== passconfirm) {
		errors.push({ msg: "Passwords don't match" });
	}

	if (password.length < 8) {
		errors.push({ msg: 'Password should be at least 8 characters' });
	}

	if (errors.length > 0) {
		res.render('register', { errors, email, password, passconfirm });
	} else {
		User.findOne({ email: email }).then((user) => {
			if (user) {
				errors.push({ msg: 'Email already registered' });
				res.render('register', { errors, email, password, passconfirm });
			} else {
				const newUser = new User({ email, password });

				bcrypt.genSalt(12, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;

						newUser.password = hash;

						newUser
							.save()
							.then((user) => {
								req.flash('success_msg', 'Registered user successfully');
								res.redirect('/users/login');
							})
							.catch((err) => console.log(err));
					})
				);
			}
		});
	}
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'Logged out successfuly');
	res.redirect('/users/login');
});

module.exports = router;
