const router = require('express').Router();
const { User , validateSignUp } = require('../../models/user')
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    try{
        const { error } = validateSignUp(req.body);
        if (error){
            res.status(400).send(error.details[0].message);
        }else{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const user = new User(req.body);
            await user.save();
            req.session.isLoggedIn = true;
            res.cookie('token', user.getAuthToken()).send({token: user.getAuthToken()});
        };
    }catch(ex){
        res.status(500).send(ex.message);
    }
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({ account: req.body.account});
        if(!user){ 
            res.status(400).send('User Not Found!');
        }else if( !(await bcrypt.compare(req.body.password, user.password)) ){
            res.status(400).send('Invalid Password');
        }else{
            req.session.isLoggedIn = true;
            res.cookie('token', user.getAuthToken()).send({token: user.getAuthToken()});
        }
        
    }catch(ex){
        res.status(500).send(ex.message);
    }
});
router.post('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    res.send({ hasLoggedOut: true });
});

module.exports = router;