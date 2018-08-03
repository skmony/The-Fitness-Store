

var middlewareObj={};
middlewareObj.checkAdmin=function(req,res,next){
        if(req.isAuthenticated()){
           if(req.user.isAdmin){
                return next();
           }
           else{
               req.flash("error","You don't have permission to do that");
               res.redirect("/items");
           }
        }else{
            req.flash("error","You need to be logged in to do that!");    
            res.redirect("/login");
       }
}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
         return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}


module.exports=middlewareObj;
