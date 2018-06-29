var trex = require('trex');
var CONFIG = require('../config');
var router = require('express').Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/'+CONFIG.db.name);

var UserSchema = mongoose.Schema({
	email:String,
	password:String
});

UserSchema.methods.create = function (data) {
	var token = {};
	var promise = new Promise((resolve,reject) => {
		if(!data.email) {
			reject({status:400,message:'Email is required.'});
		} else if(!data.password) {
			reject({status:400,message:'Password is required.'});
		} else {
			User.findOne({email:data.email}).then(user => {
				if(user) {
					reject({status:400,message:data.email+' is already registered to an account.'});
				} else {
					var user = new User(data);
					user.save().then(function () {
						user = JSON.parse(JSON.stringify(user));
						token.value = jwt.sign({id:user._id,_id:user._id}, CONFIG.secretKey, {
			                expiresIn: '366 days'
			            });
			            token.expires = new Date();
					    token.expires.setFullYear(token.expires.getFullYear() + 1);
					    user.password = null;
					    user.token = token;
			            resolve(user);
					}).catch(reject);
				}
			}).catch(reject);
		}
	});
	
	return promise;
};

UserSchema.methods.login = function (data) {
	var token = {};
	var promise = new Promise((resolve,reject) => {
		if(!data.email) {
			reject({status:400,message:'Email is required.'});
		} else if(!data.password) {
			reject({status:400,message:'Password is required.'});
		} else {
			User.findOne({email:data.email}).then(user => {
				if(user) {
					if(user.password === data.password) {
						user = JSON.parse(JSON.stringify(user));
						token.value = jwt.sign({id:user._id,_id:user._id}, CONFIG.secretKey, {
			                expiresIn: '366 days'
			            });
			            token.expires = new Date();
					    token.expires.setFullYear(token.expires.getFullYear() + 1);
					    user.password = null;
					    user.token = token;
			            resolve(user);
					} else reject({status:400,message:'Incorrect Password.'});
				} else {
					reject({status:400,message:data.email+' is not registered to an account.'});
				}
			}).catch(reject);
		}
	});
	
	return promise;
};

UserSchema.methods.changePassword = function (data) {
	var promise = new Promise((resolve,reject) => {
		if(!data.oldPassword) {
			reject({status:400,message:'Old password is required.'});
		} else if(!data.newPassword) {
			reject({status:400,message:'New password is required.'});
		} else if(!data._id) {
			reject({status:400,message:'Could not find user account.'});
		} else {
			User.findOne({_id:data._id}).then(user => {
				if(user) {
					if(user.password === data.oldPassword) {
						user.password = data.newPassword;
						user.save().then(resolve).catch(reject);
					} else reject({status:400,message:'Incorrect Password.'});
				} else {
					reject({status:400,message:'Could not find user account.'});
				}
			}).catch(reject);
		}
	});
	
	return promise;
};

UserSchema.methods.emailAvailable = function (email, currentUserId) {
	var promise = new Promise((resolve,reject) => {
		if(!email) {
			reject({status:400,message:'Email is required.'});
		} else {
			User.count({email}).then(user => {
				if(user && user._id !== currentUserId) {
					reject({status:400,message:email+' is already registered to an account.'});
				} else {
					resolve();
				}
			}).catch(reject);
		}
	});
	
	return promise;
};

var User = mongoose.model('User',UserSchema);

router.post('/', function (req,res) {
	User.prototype.create(req.body).then(function (data) {
		res.send(JSON.stringify(data));
	}).catch(function (err) {
		console.log('Signup Error');
		console.log(err);
		if(err.status && err.status === 400)
			res.status(400).send(err.message);
		else
			res.status(500).send(err);
	});
});

router.post('/login', function (req,res) {
	User.prototype.login(req.body).then(function (data) {
		res.send(JSON.stringify(data));
	}).catch(function (err) {
		console.log('Login Error');
		console.log(err);
		if(err.status && err.status === 400)
			res.status(400).send(err.message);
		else
			res.status(500).send(err);
	});
});

router.use(require('../utilities/tokenAuth.js'));

router.get('/emailAvailable', function (req,res) {
	User.prototype.emailAvailable(req.query.email, req.user._id).then(function (data) {
		res.sendStatus(200);
	}).catch(function (err) {
		console.log('Email Available Error');
		console.log(err);
		if(err.status && err.status === 400)
			res.status(400).send(err.message);
		else
			res.status(500).send(err);
	});
});

router.post('/changePassword', function (req,res) {
	req.body._id = req.user._id;
	User.prototype.changePassword(req.body).then(function (data) {
		res.send(JSON.stringify(data));
	}).catch(function (err) {
		console.log('Change Password Error');
		console.log(err);
		if(err.status && err.status === 400)
			res.status(400).send(err.message);
		else
			res.status(500).send(err);
	});
});

module.exports = router;