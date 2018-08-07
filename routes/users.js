const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//carregar model
require('../models/User');
const User = mongoose.model('users')

//rota login
router.get('/login', (req, res) => {
    res.render('users/login');

});

//post do login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);   
});

//rota registrar usuário
router.get('/register', (req, res) => {
    res.render('users/register');

});

//post do form
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'As senhas não são iguais' })
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Senha tem que ter no mínimo 4 caracteres' })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email já cadastrado');
                    res.redirect('/users/login')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('sucess_msg', 'Você foi registrado');
                                    res.redirect('/users/register')
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        });

                    });

                }
            })

    }
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('sucess_msg', 'Desconectado');
    res.redirect('/users/login');
});


module.exports = router;