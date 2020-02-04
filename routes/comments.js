var express=require("express");
var router=express.Router();
var Cause=require("../models/cause");
var Comment=require("../models/comment");

//================
// comments routes
//================

router.get("/causes/:id/comments/new",isLoggedIn,function(req,res){
  Cause.findById(req.params.id,function(err,cause){
    if(err){
      console.log(err);
    }else{
        res.render("new_comment",{cause:cause});
    }
  });

});

router.post("/causes/:id/comments",isLoggedIn,function(req,res){
  Cause.findById(req.params.id,function(err,cause){
    if(err){
      console.log(err);
      res.redirect("/causes")
    }else{
        Comment.create(req.body.comment,function(err,comment){
          if(err){
            console.log(err);
          }else{
            cause.comments.push(comment);
            cause.save();
            res.redirect('/causes/' + cause._id);
          }
        });
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports=router;
