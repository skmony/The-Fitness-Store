var express=require("express");
var router=express.Router();
var middleware=require("../middleware");


router.get("/",function(req,res){
    res.render("home");
});

router.get("/cart",middleware.isLoggedIn,function(req, res) {
    res.render("cart");
});


module.exports=router;