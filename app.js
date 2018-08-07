const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//rotas
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//config. passport
require('./config/passport')(passport);

global.db = mongoose.connect('mongodb://localhost:27017/vidjot-dev');
mongoose.connection.on('connected', function () {
    console.log('====CONEXAO ESTABELECIDA====')
});

mongoose.connection.on('error', function (err) {
    console.log('====Ocorreu um erro: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('====CONEXAO FINALIZADA====')
});

//handlebars middlewares
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body-parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//pasta estática
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));
//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//flash
app.use(flash());

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Variáveis
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//about route
app.get('/about', (req, res) => {
    res.render('about');
});

//usar rotas
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(3000, () => {
    console.log('Servidor no ar')
});