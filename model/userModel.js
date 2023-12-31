const mongoose  = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,

    },
    authentication:{
        password:{type:String,required:true,select:false},
        salt:{type:String,select:false},
        sessionToken:{type:String,select:false}
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

})

const User = mongoose.model('User',userSchema);

module.exports = User;