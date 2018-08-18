const mongoose = require('mongoose');
const _ = require('lodash');

var ViaggioSchema = new mongoose.Schema({

  id: {type: Number, trim: true, minlength: 1,unique: true},

  nome: {type: String,require: true},

  titolo: {type:String,required:false, minlength:1},

  sottotitolo: {type:String,required:false},

  sommario: {type:String,required:false},

  descrizione: {type:String,required:false, minlength:1},

  destinazione: {type:String,required:true},

  tag: {type:String, required:false},

  url: {type:String, required:false, minlength:1},

  partenza: {type:String, required:false, minlength:1},

  ritorno: {type:String,required:false, minlength:1},

  multimedia: {type:{id:{type:Number,required:true,unique:true},  
                     tipo:{type:String,required:true,minlength:3},
                     titolo:{type:String,required:true,minlength:1},
                     url:{type:String,required:true,minlength:1},
                     urls:{type:[String],required:false},
                     alt:{type:String,required:false},
                     data:{type:String,required:true,default: Date.now},
                     luogo:{type:String,required:false},
                     autore:{type:String,required:false}}, required:false},

  album: {type:{id:{type:Number,required:true},
                titolo:{type:String, required:false},
                multimedia:{type: [{id:{type:Number,required:true,unique:true},  
                                    tipo:{type:String,required:true,minlength:3},
                                    titolo:{type:String,required:true,minlength:1},
                                    url:{type:String,required:true,minlength:1},
                                    urls:{type:[String],required:false},
                                    alt:{type:String,required:false},
                                    data:{type:String,required:true,default: Date.now},
                                    luogo:{type:String,required:false},
                                    autore:{type:String,required:false}}], required:false},
                data:{type:String, required:false},
                autore:{type:String, required:false}},required:false},

  tappe:{type:[{id:{type:Number, required:false},
                titolo:{type:String, required:false},
                sottotitolo:{type:String, required:false},
                descrizione:{type:String, required:false},
                destinazione:{type:String, required:false},
                tag:{type:String, required:false},
                url:{type:String, required:false},
                partenza:{type:String, required:false},
                ritorno:{type:String, required:false},
                multimedia:{type:{id:{type:Number,required:true,unique:true},  
                                  tipo:{type:String,required:true,minlength:3},
                                  titolo:{type:String,required:true,minlength:1},
                                  url:{type:String,required:true,minlength:1},
                                  urls:{type:[String],required:false},
                                  alt:{type:String,required:false},
                                  data:{type:String,required:true,default: Date.now},
                                  luogo:{type:String,required:false},
                                  autore:{type:String,required:false}}, required:false},
                album:{type:[{id:{type:Number,required:true,unique:true},  
                              tipo:{type:String,required:true, minlength:3},
                              titolo:{type:String,required:true, minlength:1},
                              url:{type:String,required:true,minlength:1},
                              urls:{type:[String],required:false},
                              alt:{type:String, required:false},
                              data:{type:String,required:true, default: Date.now},
                              luogo:{type:String,required:false},
                              autore:{type:String, required:false}}],required:false},
                 tappe:{type:[{
                       id:{type:Number, required:false},
                       titolo:{type:String, required:false},
                       sottotitolo:{type:String, required:false},
                       descrizione:{type:String, required:false},
                       destinazione:{type:String, required:false},
                       tag:{type:String, required:false},
                       url:{type:String, required:false},
                       partenza:{type:String, required:false},
                       ritorno:{type:String, required:false},
                       multimedia:{type:{id:{type:Number,required:true,unique:true},  
                                         tipo:{type:String,required:true,minlength:3},
                                       titolo:{type:String,required:true,minlength:1},
                                       url:{type:String,required:true,minlength:1},
                                       urls:{type:[String],required:false},
                                       alt:{type:String,required:false},
                                       data:{type:String,required:true,default: Date.now},
                                       luogo:{type:String,required:false},
                                       autore:{type:String,required:false}}, required:false},
                       album:{type:[{id:{type:Number,required:true,unique:true},  
                                     tipo:{type:String,required:true, minlength:3},
                                     titolo:{type:String,required:true, minlength:1},
                                     url:{type:String,required:true,minlength:1},
                                     urls:{type:[String],required:false},
                                     alt:{type:String, required:false},
                                     data:{type:String,required:false, default: Date.now},
                                     luogo:{type:String,required:false},
                                     autore:{type:String, required:false}}],required:false}}], required:false}}],required:false},

  tsCreazione:{type:Date, required:false}
});

ViaggioSchema.methods.toJSON = function () {
  var viaggio = this;
  var viaggioObject = viaggio.toObject();
  
  return viaggioObject;
};

ViaggioSchema.pre('save', function (next) {
    let viaggio = this;

    var query = Viaggio.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    query.select('id');
    
    query.exec(function (err, con) {
        if (err){
            throw new Error('errore in preSave Viaggio');
        }

        viaggio.id = (con)? con.id + 1 : 1;
        viaggio.tsCreazione = new Date();
        next();
    });
});
  
ViaggioSchema.statics.findAllViaggi = function(){
  var Viaggio = this;
  return Viaggio.find().sort({tsCreazione:'descending'});
};

var Viaggio = mongoose.model('Viaggio', ViaggioSchema);

module.exports = {Viaggio}
