var mongoose = require('mongoose')
var crypto = require('crypto')
var Schema = mongoose.Schema;
var validator = require('validator');
/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    index: true
	},
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'public/client/img/profile/default.png'
  },
  created: {
    type: Date,
    default: Date.now
  },
  session: {
    type: String,
    trim: true,
    default: '-1',
    index: true
  },
  phone:{
    type:String,
    trim: true
  },
  wechat:{
    type: String,
    trim: true
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerID: {
    type: String,
    trim: true,
    index: true
  },
  providerData: {},
  additionalProvidersData: {}
  // username: {
  //   type: String,
  //   unique: 'Username already exists',
  //   required: 'Please fill in a username',
  //   lowercase: true,
  //   trim: true
  // },
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);


module.exports = mongoose.model('User', UserSchema);