const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('views', path.join(__dirname, 'view'));
app.engine('ejs', engine);
app.set('view engine',  'ejs');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.set('port', 3000);
app.set('hostname', '127.0.0.1');
//routes
app.use('/', require('./routes/index'));

app.listen(app.get('port'), app.get('hostname'), ()=> {
    console.log(`El servidor se está ejecutando en http://${app.get('hostname')}:${app.get('port')}/`);
});

