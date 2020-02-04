var mongoose =require("mongoose");
var  Cause=require("./models/cause");
var Comment=require("./models/comment");
// var User=require("./models/User");
//mongoose.connect("mongodb://localhost/help_your_cause");
var data=[{
  name:"fire3",
  image:"https://pixabay.com/get/57e2d6444256b108f5d084609620367d1c3ed9e04e50744175287fd09f49c2_340.jpg",
  description:"blah blah blah"
  },
  {
    name:"fire2",
    image:"https://pixabay.com/get/55e8d24a4a51ad14f6da8c7dda793f7f1636dfe2564c704c7d2f7cd09345c15f_340.jpg",
    description:"blah blah blah"
  },
  {
    name:"pmr",
    image:"https://pixabay.com/get/57e0d1454c57a414f6da8c7dda793f7f1636dfe2564c704c7d2f7dd39049c751_340.jpg",
    description:"Compile Bootstrap with your own asset pipeline by downloading our source Sass, JavaScript, and documentation files. This option requires some additional tooling:"
  }
  ]

function seeDB(){
  Cause.remove({},function(err){
    if(err){
      console.log(err);
     }
     console.log("removed Causes!");

     data.forEach(function(seed){
       Cause.create(seed,function(err,cause){
         if(err){
           console.log(err);
         }else{
           console.log("added a causes");
          Comment.create({
             text:"This pace is grate but i wish there was internet ",
             author:"Prem"
              },function(err,comment){
                if(err){
                  console.log(err);
                }else{
                  cause.comments.push(comment);
                  cause.save();
                  console.log("created new comment");
                  }

                });
         }
       });
    });

  });

}

module.exports=seeDB;
