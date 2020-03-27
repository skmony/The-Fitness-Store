var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var nodemailer = require("nodemailer")


router.get("/", function (req, res) {
    res.render("home");
});

router.get("/cart", middleware.isLoggedIn, function (req, res) {
    res.render("cart")
});

router.get("/contact", function (req, res) {
    res.render("contact");
});

router.post("/contact", function (req, res) {
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
        tls: {
            rejectUnauthorized: false
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
            req.flash("error", error.message)
            res.redirect("back");
        }
        req.flash("success", "Your email was sent to our adminstrator, we will get to you shortly");
        res.redirect("back");
    });
});

router.get("/calculatebmi", (req, res) => {
    res.render("bmicalculator")
});

router.post("/calculatebmi", (req, res) => {
    //console.log(req.body)
    teeVariable = 0
    if (req.body.tee == "Little to no exercise") {
        teeVariable = 1.2
    } else if (req.body.tee == "Light exercise (1-3 days per week)") {
        teeVariable = 1.375
    } else if (req.body.tee == "Moderate exercise ( 3-5 days per week)") {
        teeVariable = 1.55
    } else if (req.body.tee == "Heavy exercise( 6-7 days per week)") {
        teeVariable = 1.725
    } else if (req.body.tee == "Very heavy exercise( twice per day, extra heavy workouts)") {
        teeVariable = 1.9
    } else {

    }
    let BMR;
    if (req.body.gender == "Male") {
        BMR = (10 * req.body.weight) + (6.25 * req.body.height) - (5 * req.body.age) + 5
    } else if (req.body.gender == "Female") {
        BMR = (10 * req.body.weight) + (6.25 * req.body.height) - (5 * req.body.age) - 161
    }
    var data = {
        gender: req.body.gender,
        weight: Number(req.body.weight),
        height: Number(req.body.height),
        age: Number(req.body.age),
        tee: req.body.tee,
        teeVariable: teeVariable,
        BMI: (req.body.weight / Math.pow(req.body.height / 100, 2)).toFixed(2),
        BMR: Math.round(BMR),
        TEE: Math.round(BMR * teeVariable)
    }
    console.log(data);
    res.render("bmi", { data: data })
});

module.exports = router;