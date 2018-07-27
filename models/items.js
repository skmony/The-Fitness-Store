var mongoose=require("mongoose");

var itemSchema=new mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    quantity:String,
    description:String
});

module.exports=mongoose.model("Item",itemSchema);