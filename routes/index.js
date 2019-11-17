const router = require('express').Router();
const area_list = require('../resource/area-list');
const title_list = require('../resource/title-list');
const party_list = require('../resource/party-list');    
router.get('/' , async (req, res) => {
    
    res.render('index', {
        area_list: area_list,
        title_list: title_list,
        party_list: party_list,
        isLoggedIn: req.session.isLoggedIn
    });
});

module.exports = router;