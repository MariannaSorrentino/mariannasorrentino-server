const mongoose = require('mongoose');
const _ = require('lodash');

var SezioneSchema = new mongoose.Schema({
  
  id:{type: Number, trim: true, minlength: 1, unique: true },
  
  nome: {type: String, require: true, required:1 },
  
  descrizione:{type:String, required:false, minlength:1 },

  progressivoPresentazione:{type:Number, required:true },

  etichetta:{type:String, required:false, minlength:1 },
  
  attiva:{type:Boolean, required:true },

  visibile:{ type:Boolean, required:true },
  
  url:{type:String, required:false},

  multimedia: {type:{id:{type:Number, required:true, unique:true },  
                     tipo:{type:String, required:true, minlength:3 },
                     titolo:{type:String, required:true, minlength:1 },
                     url:{type:String, required:true, minlength:1 },
                     urls:{type:[String], required:false },
                     alt:{type:String, required:false },
                     data:{type:String, required:true, default: Date.now},
                     luogo:{type:String, required:false },
                     autore:{type:String, required:false }}, required:false },

  dataCreate:{type:Date, required:false}
});

SezioneSchema.methods.toJSON = function () {
  var sezione = this;
  var sezioneObject = sezione.toObject();
  
  return sezioneObject;
};

SezioneSchema.pre('save', function (next) {
    let sezione = this;

    var query = Sezione.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    query.select('id');
    
    query.exec(function (err, cit) {
        if (err){
            throw new Error('errore in preSave Sezione');
        }

        sezione.id = (cit)? cit.id + 1 : 1;
        sezione.dataCreate = new Date();
        next();
    });
});
  
SezioneSchema.statics.findAllSezioni = function () {
    var Sezione = this;
    return Sezione.find().sort({progressivoPresentazione: 'ascending'});

};


var Sezione = mongoose.model('Sezione', SezioneSchema);

module.exports = {Sezione}
