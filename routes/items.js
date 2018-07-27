var express=require("express");
var router=express.Router();
var Item=require("../models/items");
var User=require("../models/user");

router.get("/items",function(req,res){
    Item.find({},function(err,items){
        if(err){
            console.log(err)
        }else{
            res.render("index",{items:items});
        }
    });
});

router.post("/items",function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var quantity=req.body.quantity;
    var description=req.body.description;
    
    var newItem={name:name,price:price,image:image,description:description,quantity:quantity};
    Item.create(newItem,function(err,newitem){
        if(err){
            console.log(err);
        }else{
            res.redirect("/items")
        }
    })
    res.redirect("/items")
});

router.get("/items/new",function(req, res) {
   res.render("new") 
});

router.get("/items/:id",function(req, res) {
    Item.findById(req.params.id,function(err,foundItem){
        if(err){
            console.log(err)
        }else{
              res.render("show",{item:foundItem}); 
        }
    });  
});

router.get("/items/:id/add",function(req,res){
   Item.findById(req.params.id,function(err, foundItem){
       if(err){
           console.log(err);
       }else{
           console.log(foundItem);
       }
       
   });
   
});

router.get("/items/:id/buy",function(req,res){
   res.send("Connecting to buying");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next;
    }
    res.redirect("/login");
}

module.exports=router;