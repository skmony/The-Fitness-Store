var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Item = require("./models/items"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    User = require("./models/user");

var itemRoutes = require("./routes/items"),
    authRoutes = require("./routes/auth"),
    indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb+srv://skmony:skmony-project@cluster0.q2qqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb+srv://skmony:skmony-project@cluster0.q2qqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Passport Configuration
app.use(require("express-session")({
    secret: "Hey there , this  is Shashikant Mony.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//REQUIRING Routes
app.use(indexRoutes);
app.use(authRoutes);
app.use(itemRoutes);

app.get("*", function (req, res) {
    res.render("notFound");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, process.env.IP, function () {
    console.log("Server has started " + PORT);
});

// app.listen(8000, () => {
//     console.log("Server started on port:8000")
// })