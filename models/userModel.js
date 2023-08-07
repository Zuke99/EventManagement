const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema=new mongoose.Schema({
    name:String,
    username:{
        type:String,
    },
    email:{
        type:String,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please enter a valid Email Address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:String,
    role:Number

});

module.exports=mongoose.model('Users',userSchema);