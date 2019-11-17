const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/me', verify, (req, res) => {
    res.render('profile', {user: req.user, isLoggedIn: req.session.isLoggedIn });
});

function verify(req, res, next){
    
    try{
        const decoded = jwt.verify(req.cookies.token, 'privatekey');
        req.user = decoded.user;
        next();
    }catch(ex){
        res.status(403).send('Actions Forbidden: Failed to Authentication');
        console.log(ex.message);
    }
}

module.exports = router;