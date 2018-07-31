var express=require("express");
var router=express.Router();
var Item=require("../models/items");
var User=require("../models/user");

//INDEX - show all campgrounds
router.get("/items", function(req, res){
    var perPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Item.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allItems) {
            Item.countDocuments({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allItems.length < 1) {
                        noMatch = "We don't have the product you are looking for, please try again";
                    }
                    res.render("index", {
                        items: allItems,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        Item.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allItems) {
            Item.countDocuments().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("index", {
                        items: allItems,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
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
            res.redirect("/items/"+newitem.id)
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
   console.log("error");
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

router.get("/items/:id/edit",function(req, res) {
    Item.findById(req.params.id,function(err, foundItem) {
        if(err){
            res.redirect("/items")
        }else{
            res.render("edit",{item:foundItem});          
        }
    })
   
});

router.put("/items/:id",function(req,res){
   Item.findByIdAndUpdate(req.params.id,req.body.item,function(err,updatedItem){
      if(err){
          res.redirect("/items");
      } else{
          res.redirect("/items/"+req.params.id)
      }
   }); 
});

router.delete("/items/:id",function (req,res){
    Item.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/items");
        }else{
            res.redirect("/items");
        }
    });
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next;
    }
    res.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;