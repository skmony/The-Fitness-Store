var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get("/register",function(req,res){
   res.render("register"); 
});

router.post("/register",function(req,res){
    var newUser=new User({
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       email:req.body.email,
       username:req.body.username,
       mobileNo:req.body.mobileNo,
       addressLine1:req.body.addressLine1,
       addressLine2:req.body.addressLine2,
       city:req.body.city,
       state:req.body.state,
       pincode:req.body.pincode
    });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req,res,function(){
               res.redirect("/items"); 
            });
        
    });
    
});

//LOGIN Routes
router.get("/login",function(req,res){
   res.render("login");
});
//handling login logic
router.post("/login",passport.authenticate("local",
    {
    successRedirect: "/items",
    failureRedirect:"/login"
    }),function(req, res) {
});

router.get("/logout",function(req, res) {
  req.logout(); 
  res.redirect("/");
});

module.exports=router;