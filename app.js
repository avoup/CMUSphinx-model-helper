const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const dictRoutes = require('./routes/dict');
const audioRoutes = require('./routes/audio');
const lmRoutes = require('./routes/lm');
const listRoutes = require('./routes/list');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dict', dictRoutes);
app.use('/audio', audioRoutes);
app.use('/lm', lmRoutes);
app.use('/list', listRoutes);

app.listen(3000);