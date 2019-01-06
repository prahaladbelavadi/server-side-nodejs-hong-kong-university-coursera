const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  promotionSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: ""
    },
    price:{
    type:String    
    },
    description:{
        type:String
    }

});

var Promotions =  mongoose.model('promotion', promotionSchema);

module.exports = Promotions;