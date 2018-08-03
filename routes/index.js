var express=require("express");
var router=express.Router();
var middleware=require("../middleware");
var nodemailer=require("nodemailer")


router.get("/",function(req,res){
    res.render("home");
});

router.get("/cart",middleware.isLoggedIn,function(req, res) {
    res.render("cart");
});

router.get("/contact",function(req,res){
    res.render("contact");
});

router.post("/contact",function(req,res){
   const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "shashimony64@gmail.com", // generated ethereal user
            pass: process.env.GMAILPW
            },
            tls:{
              rejectUnauthorized:false
            }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: "The Fitness Store", 
        to: 'shashikantmony46@gmail.com', 
        subject: "The Fitness Store's Mail ", 
        text: 'Hello world?', 
        html: output 
    };
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error",error.message)
            res.redirect("back");
        }
        req.flash("success","Your email was sent to our adminstrator, we will get to you shortly");
        res.redirect("back");
    });
});



module.exports=router;