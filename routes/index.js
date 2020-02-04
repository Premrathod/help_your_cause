var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
  res.render("index");
});


router.get("/signup",function(req,res){
  res.render("signup");
});

router.post("/signup",function(req,res){
  var newUser=new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("signup");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/causes");
    })
  });
});

router.get("/login",function(req,res){
  res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
      successRedirect:"/causes",
      failureRedirect:"/login"
    }),function(req,res){

});

router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/causes");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports=router;
