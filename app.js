// /* Template Name: Lezir - Responsive Bootstrap 4 Landing Page Template
//    Author: Themesbrand
//    Version: 2.0.0
//    File Description: Main js file
// */



// //  Window scroll sticky class add
function windowScroll() {
    const navbar = document.getElementById("navbar");
    if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
    ) {
        navbar.classList.add("nav-sticky");
    } else {
        navbar.classList.remove("nav-sticky");
    }
}

// window.addEventListener('scroll', (ev) => {
//     ev.preventDefault();
//     windowScroll();
// })


// Smooth scroll 
// var scroll = new SmoothScroll('#navbar-navlist a', {
//     speed: 500,
//     offset: 70
// });


// // Navbar Active Class

// var spy = new Gumshoe('#navbar-navlist a', {
//     // Active classes
//     navClass: 'active', // applied to the nav list item
//     contentClass: 'active', // applied to the content
//     offset: 80
// });


// Contact Form
function validateForm() {
    var name = document.forms["myForm"]["name"].value;
    var email = document.forms["myForm"]["email"].value;
    var comments = document.forms["myForm"]["comments"].value;
    document.getElementById("error-msg").style.opacity = 0;
    document.getElementById('error-msg').innerHTML = "";
    if (name == "" || name == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Name*</div>";
        fadeIn();
        return false;
    }
    if (email == "" || email == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Email*</div>";
        fadeIn();
        return false;
    }
    if (comments == "" || comments == null) {
        document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning'>*Please enter a Comments*</div>";
        fadeIn();
        return false;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("simple-msg").innerHTML = this.responseText;
            document.forms["myForm"]["name"].value = "";
            document.forms["myForm"]["email"].value = "";
            document.forms["myForm"]["comments"].value = "";
        }
    };
    xhttp.open("POST", "php/contact.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("name=" + name + "&email=" + email  + "&comments=" + comments);
    return false;
}

function fadeIn() {
    var fade = document.getElementById("error-msg");
    var opacity = 0;
    var intervalID = setInterval(function () {
        if (opacity < 1) {
            opacity = opacity + 0.5
            fade.style.opacity = opacity;
        } else {
            clearInterval(intervalID);
        }
    }, 200);
}

// -------------------------------------------------------------------------------------------


// Preloader
// window.onload = function preloader() { 
//     setTimeout(() => {
//         document.getElementById('preloader').style.visibility = 'hidden';
//         document.getElementById('preloader').style.opacity = '0';
//         window.Unicons.refresh();
//     }, 1000);
// } 

// feather icon
// feather.replace()


//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
// const encrypt = require('mongoose-encryption')  // Encryption based
// const md5 = require('md5')                      // Hashing [How to use - password: md5(req.body.password)]
// const bcrypt = require('bcrypt');              // Hashing with a constant alphanumeric values at end of password
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const path = require('path');

const app = express();

// console.log(process.env.API_KEY); // For checking what the API_KEY looks like

// app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser : true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(express.static('public'))

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.get('/views/login', function(req, res){
    res.render('login')
});

app.get('/views/register', function(req, res){
    res.render('register')
});

app.get('/secrets', function(req, res){
    if (req.isAuthenticated()){
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post("/register", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets')
            });
        }
    });
});

app.post('/login', function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            })
        }
    })
    
});



app.listen(3000, function(){
    console.log("Server running on 3000")
});


// Users

// 1@2.com - 123
// a@b.com - qwerty
// user@hash.com - 123456
// user@bcrypthash.com - 123456
// user@passportlocalmongoose.com - 123456
// j@y.com - jay

// incrption/hashing REGISTER and LOGIN routes 
// app.post("/register", function(req,res){
//     bcrypt.hash(req.body.password, saltRounds, function(err, hash){
//         const newUser = new User({
//         email: req.body.username,
//         password: hash
//     })
//     newUser.save(function(err){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("Secrets");
//         }
//     });
//     })

    
// })

// app.post('/login', function(req, res){
//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}, function(err, foundUser){
//         if(err) {
//             console.log(err);
//         } else {
//             if(foundUser) {
//                 bcrypt.compare(password, foundUser.password, function(err, result){
//                     if (result === true){
//                         res.render("secrets");
//                     }
//                 })
                    
                
//             }
//         }
//     });
// });