const verifyLogin=(req,res,next)=>{
    if(req.session.loggIn){
        next()
    }
    else{
        res.redirect('/login');
    }
}

module.exports=verifyLogin