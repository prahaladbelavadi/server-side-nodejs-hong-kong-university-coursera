const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema =new Schema({
    name:{
        type:String,
        required: true,
        unique:true
    } ,
    image:{
        type: String,
        default: ""
    }, 
    designation: {
        type:String,
        default: ""
    },
    abbr:{
        type: String,
    },
     featured:{
        default:false
    }, 
     description:{
        type:String,
        unique:true
    }
});
var Leaders =  mongoose.model('leaders', leaderSchema)

module.exports = Leaders; 