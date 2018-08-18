const mongoose = require('mongoose');
const _ = require('lodash');

var ContenutoSchema = new mongoose.Schema({
  id:{
    type: Number,
    trim: true,
    minlength: 1,
    unique: true
  },
  sezione: {
    type: String,
    require: true
  },
  titolo:{
      type:String,
      required:false,
      minlength:1
  },
  corpo:{
    type:String,
    required:false,
    minlength:1
  },
  lingua:{
    type:String,
    required:false,
    minlength:1
  },
  attivo:{
    type:Boolean,
    required:true
  },
  tsCreazione:{
    type:Date,
    required:false,
    minlength:1
  },
  autore:{
    type:String,
    required:false,
    minlength:1   
  },
  commento:{
    type:String,
    required:false,
    minlength:1
  },
  multimedia:{
    type:{
        id:{
          type:Number,
          required:true,
          unique:true
        },  
        tipo:{
          type:String,
          required:true,
          minlength:3
        },
        titolo:{
          type:String,
          required:true,
          minlength:1
        },
        url:{
          type:String,
          required:true,
          minlength:1
        },
        urls:{
          type:[String],
          required:false
        },
        alt:{
          type:String,
          required:false
        },
        data:{
          type:String,
          required:true,
          default: Date.now
        },
        luogo:{
          type:String,
          required:false
        },
        autore:{
          type:String,
          required:false
        }
    },
    required:true,
  },
  album:{
  type:[{
    id:{
      type:Number,
      required:true,
      unique:true
    },  
    tipo:{
      type:String,
      required:true,
      minlength:3
    },
    titolo:{
      type:String,
      required:true,
      minlength:1
    },
    url:{
      type:String,
      required:true,
      minlength:1
    },
    urls:{
      type:[String],
      required:false
    },
    alt:{
      type:String,
      required:false
    },
    data:{
      type:String,
      required:true,
      default: Date.now
    },
    luogo:{
      type:String,
      required:false
    },
    autore:{
      type:String,
      required:false
    }
  }],
  required:false
  },
  campi:{
  type:[String],
  required:false
  },
  links:{
  type:[String],
  required:false
  }
});

ContenutoSchema.methods.toJSON = function () {
  var contenuto = this;
  var contenutoObject = contenuto.toObject();
  
  return contenutoObject;
};

ContenutoSchema.pre('save', function (next) {
    let contenuto = this;

    var query = Contenuto.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    query.select('id');
    
    query.exec(function (err, con) {
        if (err){
            throw new Error('errore in preSave Contenuto');
        }

        contenuto.id = (con)? con.id + 1 : 1;
        contenuto.tsCreazione = new Date();
        next();
    });
});
  
ContenutoSchema.statics.findAllContenuti = function(sezione){
  var Contenuto = this;
  return Contenuto.find({attivo:true}).sort({tsCreazione:'descending'});
};

var Contenuto = mongoose.model('Contenuto', ContenutoSchema);

module.exports = {Contenuto}
