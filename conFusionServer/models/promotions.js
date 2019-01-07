const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  promotionSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    image:{
        type: String        
    },
    label:{
        type: String,
        default: ""
    },
    price:{
    type:String    
    },
    description:{
        type:String,
        required: true
    }

});

var Promotions =  mongoose.model('promotion', promotionSchema);

module.exports = Promotions;