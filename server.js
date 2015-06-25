var express     = require('express'),
    app         = express(),
    session     = require('express-session'),
    postRoute   = require('./src/routes/post.js').router;

var SESSION_INFO = {
    secret: 'mamemeamasmdaer',
    cookie: { maxAge: 3600 * 1000 },
    resave: true,
    saveUninitialized: false
};

app.use(express.static('./src/static'));
app.use(session(SESSION_INFO));

app.set('view engine', 'jade');
app.set('views', './src/views');

app.get('/', function (req, res) {
    res.render('index');
});

app.use('/post', postRoute);

var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('TodoList is running at http://%s:%s', host, port);
});
