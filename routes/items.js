var express=require("express");
var router=express.Router();
var Item=require("../models/items");
var User=require("../models/user");

router.get("/items",function(req,res){
    var perPage=6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Item.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,items){
        Item.countDocuments().exec(function (err, count) {
            if(err){
                console.log(err)
            }else{
                res.render("index",{
                    items:items,
                    current: pageNumber,
                     pages: Math.ceil(count / perPage)
                });
            }
        });
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

router.get("/items/:id/add",isLoggedIn,function(req,res){
   Item.findById(req.params.id,function(err, foundItem){
       if(err){
           console.log(err);
       }else{
           console.log(foundItem);
           //currentUser.cart.push(foundItem._id);
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