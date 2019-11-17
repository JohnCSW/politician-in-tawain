const { Politician } = require('../../models/politicians');
const { getRecentNews, getPTTArticles, getYTClips } = require('../../models/news');
const router = require('express').Router();
//Get:
router.get('/', async (req, res) => {
    const politicians = await Politician
    .find()
    .select('-_id');
    if (!politicians ) { 
        res.status(404).send('No one is found given the conditions.')
        return;
    };
    res.send(politicians);   
});
router.get('/search', async (req, res) => {
    const politicians = await Politician.find();
    const candidates = politicians.filter(p => { 
        const keys = Object.keys(req.query);
        // Ensure p[k] exists first
        // Then check if the condition in the query
        // can be satisified.
        const valid_keys = keys
        .filter(k => { return p[k] ? true: false});
        
        return valid_keys.reduce((acc, key) => {
            //String.prototype.includes('') === true, means that
            //empty conditions will be ignored automatically.
            return acc && p[key].includes(req.query[key]);
        }, true);
    });

    res.send({candidates: candidates});
});
//Order matters: :id route will make conflicts against other routes.
router.get('/:id', async (req, res) => {
    res.send(
        await Politician
        .findById(req.params.id)
        .select('-_id')
    );
});
router.post('/:headline_type', async (req, res) => {
    let headlines = [];
    switch(req.params.headline_type){
        case 'news':
            headlines = await getRecentNews(req.body.name);
            break;
        case 'ptt':
            headlines = await getPTTArticles(req.body.name);
            break;
        case 'yt':
            headlines = await getYTClips(req.body.name);
            break;
        default:
            res.status(400).send('Route doesn\'t exist');
            return;
    }
    res.send({headlines: headlines});
});



module.exports = router;