const mongoose = require('mongoose');
const _ = require('lodash');

var CitazioneSchema = new mongoose.Schema({

  id:{type: Number, trim: true, minlength: 1, unique: true },
  
  commento: {type: String, require: true },

  corpo:{type:String, required:true, minlength:1 },

  autore:{ type:String, required:true, minlength:1 },
  
  libro:{type:String, required:true, minlength:1 },
  
  dataCreate:{type:Date }
});

CitazioneSchema.methods.toJSON = function () {
  var citazione = this;
  var citazioneObject = citazione.toObject();
  
  return citazioneObject;
};

CitazioneSchema.pre('save', function (next) {
    let citazione = this;

    var query = Citazione.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    query.select('id');
    
    query.exec(function (err, cit) {
        if (err){
            throw new Error('errore in preSave Citazione');
        }

        citazione.id = (cit)? cit.id + 1 : 1;
        citazione.dataCreate = new Date();
        next();
    });
});
  
CitazioneSchema.statics.findAllCitazioni = function () {
    var Citazione = this;
    return Citazione.find({},['id', 'commento', 'corpo', 'autore', 'libro', 'dataCreate']).sort({dataCreate: 'descending'});
};


var Citazione = mongoose.model('Citazione', CitazioneSchema);

module.exports = {Citazione}
