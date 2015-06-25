var express    = require('express'),
    router     = express.Router(),
    db         = require('../database/database.js'),
    bodyParser = require('body-parser'),
    markdown   = require('markdown-js').markdown;

var urlEncodedParser = bodyParser.urlencoded({extended: true});

//router.use(MustLogin);

router.get('/list', MarkdownProcessor, function (req, res) {
    db.GetLists(10, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send("Database Query Failed.");
        }

        res.render('post/list', {posts: results});
    });
});

/*router.post('/create', urlEncodedParser, function (req, res) {
    var title   = req.;

    db.CreateNewPost(title, content, author, make_NewPost(req, res));
});*/

router.get('/create', urlEncodedParser, function (req, res) {    
    var topic   = req.query.topic;

    db.CreateNewList(topic, function (err, results) {
        if (err) {            
            res.status(500).send(JSON.stringify({status: "failed"}));            
        }
        else{
            res.status(200).send(JSON.stringify({status: "success"}));
        }
    });    
});

function MarkdownProcessor (req, res, next) {
    res.locals.markdown = markdown;
    next();
}

exports.router = router;
