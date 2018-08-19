const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UtenteSchema = new mongoose.Schema({

  utente:{type:String, required:true, unique:true },

  password:{type: String, require: true, minlength: 6},

  tokens: [{ access: { type: String, required: true },
             token: {  type: String,  required: true }}]
});

UtenteSchema.methods.toJSON = function () {
  var ute = this;
  var uteObject = ute.toObject();

  return _.pick(uteObject, ['_id', 'utente']);
};

UtenteSchema.methods.generateAuthToken = function () {
  var ute = this;
  var access = 'auth';
  let token = jwt.sign({_id: ute._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  
  ute.tokens.push({access, token});

  return ute.save().then(() => {
    return token;
  });
};

UtenteSchema.methods.removeToken = function (token) {
  var ute = this;

  return ute.update({
    $pull: {
      tokens: {token}
    }
  });
};

UtenteSchema.statics.findByToken = function (token) {
  var Utente = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

  } catch (e) {
    return Promise.reject();
  }

  return Utente.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UtenteSchema.statics.findByCredentials = function (ute, password) {

  var Utente = this;
   return Utente.findOne({utente:ute}).then((ute) => {
    if (!ute) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and ute.password
      bcrypt.compare(password, ute.password, (err, res) => {
        if (res) {
          resolve(ute);
        } else {
          reject();
        }
      });
    });
  });
};

UtenteSchema.pre('save', function (next) {
  var ute = this;

  if (ute.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(ute.password, salt, (err, hash) => {
        ute.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Utente = mongoose.model('Utente', UtenteSchema);

module.exports = {Utente}
