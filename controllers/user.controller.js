const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
router.get('/', (req, res, next) => {
	return res.render('register.ejs');
});


router.post('/', async(req, res) => {
	let {email , username, password, passwordConf}= req.body;
    console.log(req.body);
	if (!email || !username || !password || !passwordConf) {
		res.send();
	} else {
		if (password == passwordConf) {
			const salt = await bcrypt.genSalt(10);
			let hashPass = await bcrypt.hash(password, salt);
			console.log(hashPass);
			User.findOne({ email: email }, (err, data) => {
				if (!data) {
						let newPerson = new User({
							email: email,
							username: username,
							password: hashPass,
						});

						newPerson.save(() => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', (req, res) => {
	return res.render('login.ejs');
});

router.post('/login', (req, res) => {
	const loggedIn = req.cookies.token;
	User.findOne({ email: req.body.email }, (err, data) => {
		if(data){
			if (bcrypt.compare(data.password, req.body.password) ) {
				    const token = jwt.sign({email: req.body.email}, process.env.TOKEN,{expiresIn: "2h",});
					res.cookie('token', token, { httpOnly: true }).send({Success: "Success!"});

		}else{
			res.send({ "Success": "Wrong password!" });
		}	
			} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

router.get('/profile', auth, (req, res) => {
	console.log("user request",req.user);
	User.findOne({email: req.user.email}, (err, data) => {
		if (!data) {
			res.redirect('/');
		} else {
			console.log("data:", data);
			return res.render('home.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/logout',auth,(req, res, ) => {
    res.cookie('token','')
	res.redirect('/');
	
});


module.exports = router;