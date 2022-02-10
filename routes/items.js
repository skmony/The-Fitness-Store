var express = require("express");
var router = express.Router();
var Item = require("../models/items");
var User = require("../models/user");
var middleware = require("../middleware");

//INDEX - show all campgrounds

router.get("/items", function (req, res) {
    var perPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Item.find({ name: regex }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allItems) {
            Item.countDocuments({ name: regex }).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if (allItems.length < 1) {
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

//add a new item
router.post("/items", middleware.checkAdmin, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var quantity = req.body.quantity;
    var description = req.body.description;

    var newItem = { name: name, price: price, image: image, description: description, quantity: quantity };
    Item.create(newItem, function (err, newitem) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/items/" + newitem.id)
        }
    })
});

router.get("/items/new", middleware.checkAdmin, function (req, res) {
    res.render("new")
});

//show route

router.get("/items/:id", function (req, res) {
    Item.findById(req.params.id, function (err, foundItem) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/items");
        } else {
            res.render("show", { item: foundItem });
        }
    });
});

//cart routes

router.get("/items/:id/add", middleware.isLoggedIn, function (req, res) {
    console.log("error");
    Item.findById(req.params.id, function (err, foundItem) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/items");
        } else {
            console.log(foundItem);
        }
    });
});

router.get("/items/:id/buy", function (req, res) {
    res.send("Connecting to buying");
});

//edit route

router.get("/items/:id/edit", middleware.checkAdmin, function (req, res) {
    Item.findById(req.params.id, function (err, foundItem) {
        if (err) {
            res.redirect("/items");
        } else {
            res.render("edit", { item: foundItem });
        }
    });

});

//update route

router.put("/items/:id", middleware.checkAdmin, function (req, res) {
    Item.findByIdAndUpdate(req.params.id, req.body.item, function (err, updatedItem) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/items");
        } else {
            req.flash("success", "Succesfully edited " + updatedItem.name)
            res.redirect("/items/" + req.params.id)
        }
    });
});

//delete route

router.delete("/items/:id", middleware.checkAdmin, function (req, res) {
    Item.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/items");
        } else {
            req.flash("success", "Item deleted");
            res.redirect("/items");
        }
    });
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;