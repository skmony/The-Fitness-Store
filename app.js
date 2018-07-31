var express         =require("express"),
    app             =express(),
    bodyParser      =require("body-parser"),
    mongoose        =require("mongoose"),
    Item            =require("./models/items"),
    methodOverride  =require("method-override"),
    passport        =require("passport"),
    localStrategy   =require("passport-local"),
    User            =require("./models/user");
    
var itemRoutes      =require("./routes/items"),
    authRoutes      =require("./routes/auth"),
    indexRoutes     =require("./routes/index");

var url=process.env.DATABASEURL||"mongodb://localhost/myShop";
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
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

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   next();
});


//REQUIRING Routes
app.use(indexRoutes);
app.use(authRoutes);
app.use(itemRoutes);

app.get("*",function(req,res){
   res.render("notFound"); 
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});