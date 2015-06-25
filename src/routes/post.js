var express    = require('express'),
    router     = express.Router(),
    db         = require('../database/database.js'),
    bodyParser = require('body-parser'),
    markdown   = require('markdown-js').markdown;

var urlEncodedParser = bodyParser.urlencoded({extended: true});

//router.use(MustLogin);

router.get('/list', MarkdownProcessor, function (req, res) {
    db.GetLists(300, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send("Database Query Failed.");
        }else{            
            res.status(200).send(JSON.stringify({status: "success", lists: results}));
        }
    });
});

router.get('/create', urlEncodedParser, function (req, res) {    
    var topic   = req.query.topic;

    db.CreateNewList(topic, function (err, results) {
        if (err) {            
            res.status(500).send(JSON.stringify({status: "failed"}));            
        }
        else{
            db.GetLatestLists(1, function (err, results) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Database Query Failed.");
                }

                res.status(200).send(JSON.stringify({status: "success", id: results[0].id}));
            });            
        }
    });    
});

router.get('/done', urlEncodedParser, function (req, res) {    
    var id   = req.query.id;

    db.DoneList(id, function (err, results) {
        if (err) {            
            res.status(500).send(JSON.stringify({status: "failed"}));            
        }
        else{            
            res.status(200).send(JSON.stringify({status: "success", id: id}));
        }
    });    
});

router.get('/delete', urlEncodedParser, function (req, res) {    
    var id   = req.query.id;

    db.DeleteList(id, function (err, results) {
        if (err) {            
            res.status(500).send(JSON.stringify({status: "failed"}));            
        }
        else{            
            res.status(200).send(JSON.stringify({status: "success", id: id}));
        }
    });    
});

function MarkdownProcessor (req, res, next) {
    res.locals.markdown = markdown;
    next();
}

exports.router = router;
