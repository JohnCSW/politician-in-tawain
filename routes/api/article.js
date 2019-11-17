const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
router.post('/add', verify ,async (req, res) => {
    const user = await User.findById(req.user._id);
    user.fav_articles.push(req.body);
    const updated_user = await user.save();
    const fav_articles = updated_user.fav_articles;
    res.send({ article_id: fav_articles[fav_articles.length - 1]._id });
    
});
router.delete('/remove', verify, async(req, res) => {
    const user = await User.findById(req.user._id);
    user.fav_articles.id(req.body.article_id).remove();
    await user.save();
    res.send('Removed!');
});
router.get('/fav_list', verify, async (req, res) => {
    const user = await User.findById(req.user._id);
    const fav_articles = user.fav_articles.filter(a => {return a.type == req.query.type });
    res.send({fav_articles: fav_articles});
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