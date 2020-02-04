var express   =require("express"),
    app       =express(),
    bodyParser=require("body-parser"),
    mongoose  =require("mongoose"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    Cause = require("./models/cause"),
    Comment=require("./models/comment"),
    User=require("./models/User"),
    seeDB=require("./seeds");

// var commentRoutes=require("./routes/comments"),
//     causeRoutes=require("./routes/causes"),
//     indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost/help_your_cause");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/pubic'));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
//seeDB();

app.use(require("express-session")({
  secret:"once again cause is too important",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
});

//app.use(indexRoutes);
//app.use(causeRoutes);
//app.use(commentRoutes);
app.get("/",function(req,res){
  res.render("index");
});

app.get("/causes",function(req,res){
 Cause.find({},function(err,allCauses){
   if(err){
     console.log(err);
   }else{
     res.render("causes",{causes:allCauses});
   }
 });

  });

app.post("/causes",function(req,res){
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

app.get("/causes/new_cause",function(req,res){
  res.render("new_cause");
});

app.get("/causes/:id",function(req,res){
  Cause.findById(req.params.id).populate("comments").exec(function(err,foundCause){
    if(err){
      console.log(err);
    }else{
      console.log(foundCause);
      res.render("show",{cause:foundCause});
    }
  });
});

app.get("/causes/:id/edit",function(req,res){
  //if(req.isAuthenticated()){
    Cause.findById(req.params.id,function(err,foundCause){
      if(err){
        res.redirect("/causes");
    }else{
      //  console.log(foundCause.author.id);
        //console.log(req.user._id);
      //  if(foundCause.author.id.equals(req.user._id)){
          res.render("edit",{cause:foundCause});
      //  }else{
    //      res.send("You do not have permission to that");
        }
    //  }
    });
  //} else{
  //  console.log("first do login!!");
  //  res.send("first do login");
//  }
});

app.put("/causes/:id",function(req,res){
  Cause.findByIdAndUpdate(req.params.id,req.body.cause,function(err,updatedCause){
    if(err){
      res.redirect("/causes");
    }else{
      res.redirect("/causes/"+ req.params.id);
    }
  });
});



app.get("/causes/:id/comments/new",isLoggedIn,function(req,res){
  Cause.findById(req.params.id,function(err,cause){
    if(err){
      console.log(err);
    }else{
        res.render("new_comment",{cause:cause});
    }
  });

});

app.post("/causes/:id/comments",isLoggedIn,function(req,res){
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

app.delete("/causes/:id",function(req,res){
  Cause.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/causes");
    }else{
      res.redirect("/causes");
    }
});
});


app.get("/signup",function(req,res){
  res.render("signup");
});

app.post("/signup",function(req,res){
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


app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
      successRedirect:"/causes",
      failureRedirect:"/login"
    }),function(req,res){

});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/causes");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.get("*",function(req,res){     //order of route is important
  res.send("hey you searched something wrong plz check !!");
});

app.listen(3000,process.env.IP,function(){
  console.log("server has sarted");
});
