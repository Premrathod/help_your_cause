var express=require("express");
var router=express.Router();
var Cause=require("../models/cause");

router.get("/causes",function(req,res){
 Cause.find({},function(err,allCauses){
   if(err){
     console.log(err);
   }else{
     res.render("causes",{causes:allCauses});
   }
 });

  });

router.post("/causes",function(req,res){
  var name=req.body.name,
      image=req.body.image,
      desc=req.body.description;
  var new_cause={name:name,image:image,description:desc};

  Cause.create(new_cause,function(err,newlyCreated){
    if(err){
      console.log(err);
    }else{
      res.redirect("/causes");
    }
  });

});

router.get("/causes/new_cause",function(req,res){
  res.render("new_cause");
});

router.get("/causes/:id",function(req,res){
  Cause.findById(req.params.id).populate("comments").exec(function(err,foundCause){
    if(err){
      console.log(err);
    }else{
      console.log(foundCause);
      res.render("show",{cause:foundCause});
    }
  });
});

module.exports=router;
