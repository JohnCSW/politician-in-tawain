const politicians = require('../resource/politicians-list.json');
const { db, Politician } = require('../models/politicians');

function saveInDB () {
    return Promise.all(politicians.map(p => {
        return new Politician(p)
        .save()
        .then(() => {console.log(`${p.name} SAVED!`)});
    }));
};

saveInDB().then(() => {
    db.disconnect(() => {
        console.log('Has Disconnected to DB!');
    });
});