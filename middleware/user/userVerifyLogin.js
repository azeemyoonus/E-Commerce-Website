const verifyLogin=(req,res,next)=>{
    if(req.session.loggIn){
        next()
    }
    else{
        console.log("calling here")
        res.redirect('/login');
        Error("not logged");
    }
}

module.exports=verifyLogin