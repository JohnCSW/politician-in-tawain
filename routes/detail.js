const router = require('express').Router();
const { Politician } = require('../models/politicians');

router.get('/:id', async (req, res) => {
    const politician = await Politician.findById(req.params.id);
    res.render('detail', { politician:politician , isLoggedIn: req.session.isLoggedIn});
});
module.exports = router;