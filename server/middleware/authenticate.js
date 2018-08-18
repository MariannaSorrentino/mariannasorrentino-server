var {User} = require('./../models/user');
var {Utente} = require('./../models/utente');

var authenticate = (req, res, next) => {

  var token = req.header('x-auth');

  Utente.findByToken(token).then((ute)=>{
    
    if (!ute) return Promise.reject();

    req.utente = ute;
    req.token = token;
    next();
    
    }).catch((e) => {
      res.status(401).send('401');
    });
 };
  

module.exports = {authenticate};
