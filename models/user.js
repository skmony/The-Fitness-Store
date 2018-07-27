var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    mobileNo:{type: String,  required: true},
    password:String,
    addressLine1:{type: String, required: true},
    addressLine2:{type: String, required: true},
    city:{type: String, required: true},
    state:{type: String, required: true},
    pincode:{type: String, required: true},
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Item"
            }
        ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);