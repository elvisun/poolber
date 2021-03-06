"use strict";

var passport = require('passport');
var users = require('../controllers/users.controller.server.js')
var policy = require('../policies/auth.policy.server.js');

module.exports = function(app) {
	// Setting up the users authentication api
	app.route('/api/auth/signup').post(users.signup);
	app.route('/api/auth/signin').post(users.signin);
	app.route('/api/auth/signout').post(users.signout);	
	app.route('/api/auth/forgot').post(users.forgot);
	app.route('/api/auth/reset/:token').get(users.validateResetToken);
	app.route('/api/auth/reset/:token').post(users.reset);

	app.route('/api/data/saveProfile').all(policy.isLoggedIn)
		.post(users.saveProfile);
	app.route('/api/data/userinfo').post(users.userinfo);

	//OAUTH
	app.route('/api/auth/facebook').get(users.oauthCall('facebook', {
		scope: ['email']
	}));
	app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));
	
	// app.route('/api/auth/wechat').get(users.oauthCall('wechat', {
	// 	scope: ['snsapi_userinfo']
	// }));
	// app.route('/api/auth/wechat/callback').get(users.oauthCallback('wechat'));


};