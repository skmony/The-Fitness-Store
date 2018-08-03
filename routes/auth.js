var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");

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
            req.flash("error",err.message)
            return res.redirect("/register");
        }
            passport.authenticate("local")(req,res,function(){
                
               const output = `
                    <h2>Hey, Welcome to The Fitness Store</h2>
                    <p>Thank you for signing up </p>
                    <p>Here at The Fitness Store we take care of all of your diet reqiurements.So,enjoy shopping at The Fitness Store</p>
                    <p>You can visit our store from <a href="https://rocky-castle-16985.herokuapp.com/">here</a></p>
                    <p>For any queries or complaints <a href="https://rocky-castle-16985.herokuapp.com/contact">Contact Us</a></p>
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
                let mailOptions = {
                    from: "The Fitness Store", 
                    to: req.body.email, 
                    subject: "The Fitness Store's Mail ", 
                    text: 'Hello world?', 
                    html: output 
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error.message)
                    }
                    console.log("Mail sent")
                });
                req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);        
                res.redirect("/items")
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
  req.flash("success","Logged you out!")
  res.redirect("/items");
});

router.get("/forgot",function(req,res){
   res.render("forgot") 
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shashimony64@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'The Fitness Store',
        subject: 'The Fitness Store password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shashimony64@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'The Fitness Store',
        subject: "The Fitness Store's password has been changed",
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/items');
  });
});


module.exports=router;