require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

var {mongoose} = require('./db/mongoose');
var {Citazione} = require('./models/model/citazione');
var {Contenuto} = require('./models/model/contenuto');
var {Sezione} = require('./models/model/sezione');
var {Viaggio} = require('./models/model/viaggio');

var {Utente} = require('./models/utente');

var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;


app.use(bodyParser.json());

app.use(cors());

 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
  
 app.get('/', (req, resp)=>{
   resp.status(200).send('API mariannasorrentino.com');
 });
// POST /utente - inserire un nuovo utente
 app.post('/utente', authenticate, (req, res) => {
   var body = _.pick(req.body, ['utente', 'password']);
   var ute = new Utente(body);

   ute.save().then(() => {
     return ute.generateAuthToken();
   }).then((token) => {
     res.header('x-auth', token).send(ute);
   }).catch((e) => {
     res.status(400).send(e);
   })
});
// GET /utenti/me - a partire dal token presente nell'header restituisce l'utente a cui il token appartiene
 app.get('/utenti/me', authenticate, (req, res) => {
    res.send(req.utente);
 });

 // POST /utenti/login - effettua il login ovvero se l'utente è censito calcola il suo token lo memorizza 
//  nella tabella e lo restituisce all'utente nella response
 app.post('/utente/login', (req, res) => {

   var body = _.pick(req.body, ['utente', 'password']);

   //var body = req.body;

  Utente.findByCredentials(body['utente'], body['password']).then((utente) => {

    return utente.generateAuthToken()}).then((token) => {
    //res.header('x-auth', token).send();
      res.status(200).send({'token':token});
    }).catch((e) => {
     res.status(400).send(e);
  });
 });

 // DELETE /utenti/me/token - dal token evince l'utente e cancella il token dalla tabella utenti
 app.delete('/utenti/me/token', authenticate, (req, res) => {
   req.utente.removeToken(req.token).then(() => {
     res.status(200).send('Token rimosso');
   }, () => {
     res.status(400).send();
   });
 });

  
//Citazioni API

// inserimento nuova Citazione - POST /citazione 
app.post('/citazione', authenticate, (req, res) => {

  var body = _.pick(req.body, ['id', 'commento', 'corpo', 'autore', 'libro']);
   
  var citazione = new Citazione(body);

  citazione.save().then(
    (doc) => {
      res.status(200).send(doc);
    },
    (e) => {
      res.status(400).send(e);
    });
 });

// GET /citazioni 
app.get('/citazioni', authenticate, (req, resp)=>{
  Citazione.findAllCitazioni().then((citazioni)=>{
    resp.status(200).send(citazioni);
  }).catch((e) => {
    resp.status(400).send(e);
  });
});

//Contenuti API

// inserimento nuovo Contenuto - POST /contenuto 
app.post('/contenuto', authenticate, (req, res) => {

  var body = _.pick(req.body, ['sezione','titolo', 'corpo', 'lingua','attivo', 'autore', 'commento', 
                               'multimedia', 'album','campi' , 'links']);
  //var body = req.body;

  var contenuto = new Contenuto(body);

  contenuto.save().then(
    (doc) => {
      res.status(200).send(doc);
    },
    (e) => {
      res.status(400).send(e);
    });
 });

 // GET /contenuti 
 app.get('/contenuti', authenticate, (req, resp)=>{
   Contenuto.findAllContenuti().then((contenuti)=>{
     resp.status(200).send(contenuti);
   }).catch((e) => {
     resp.status(400).send(e);
   });
 });

 //Sezioni API

// inserimento nuova Sezione - POST /sezione 
app.post('/sezione', authenticate, (req, res) => {

  var body = _.pick(req.body, ['id', 'nome', 'descrizione', 'progressivoPresentazione', 'etichetta',
                               'attiva', 'visibile', 'url', 'multimedia']);
  //var body = req.body;

  var sezione = new Sezione(body);

  sezione.save().then(
    (doc) => {
      res.status(200).send(doc);
    },
    (e) => {
      res.status(400).send(e);
    });
 });

 // GET /sezioni
 app.get('/sezioni', authenticate, (req, resp)=>{
   Sezione.findAllSezioni().then((sezioni)=>{
     resp.status(200).send(sezioni);
   }).catch((e) => {
     resp.status(400).send(e);
   });
 });

 //Viaggi API

// inserimento nuovo Viaggio- POST /viaggio 
app.post('/viaggio', authenticate, (req, res) => {

  //var body = _.pick(req.body, ['id', 'nome', 'descrizione', 'progressivoPresentazione', 'etichetta',
  //                             'attiva', 'visibile', 'url', 'multimedia']);

  var body = req.body;

  var viaggio = new Viaggio(body);

  viaggio.save().then(    (doc) => {
    res.status(200).send(doc);
  },
  (e) => {
    res.status(400).send(e);
  });
 });

 // GET /viaggi
 app.get('/viaggi', authenticate, (req, resp)=>{
   Viaggi.findAllViaggi().then((viaggi)=>{
     resp.status(200).send(viaggi);
   }).catch((e) => {
     resp.status(400).send(e);
   });
 });

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
