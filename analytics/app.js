const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const app = express();
app.use(express.static('public'));
app.engine('html', consolidate.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// usage
app.get('/', function(req, res) {
    res.render('index');
});
app.get('/chart', function(req, res) {
    res.render('graphics');
});
app.get('/speed', function(req, res) {
    res.render('speed');
});
app.listen(3001, () => console.log('ready'));