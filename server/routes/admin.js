const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth');
const Article = require('../models/Article');
const Subscriber = require('../models/Subscriber');
const Mail = require('../models/Mail');
const mongoose = require('mongoose');

router.get('/login', (req, res) => {
  res.render('admin/login', {
    layout: 'admin'
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true,
    failureMessage: 'email and password dont match'
  })(req, res, next);
})

router.get('/', (req, res) => {
  res.render('admin/dashboard', {
    layout: 'admin',
  });
});

router.get('/articles', (req, res) => {
  Article.find({})
    .sort({
      date: -1
    })
    .then((articles) => {
      res.render('admin/articles', {
        layout: 'admin',
        articles
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/articles/add', (req, res) => {
  res.render('admin/addArticle', {
    layout: 'admin',
  });
});

router.get('/articles/edit/:id', (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      res.render('admin/editArticle', {
        layout: 'admin',
        article
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/articles/:id', (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      res.render('admin/articlePage', {
        layout: 'admin',
        article
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/articles', (req, res) => {
  var article = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article,
  };

  new Article(article)
    .save((err) => {
      if (err) {
        console.log(err);
        console.log('error occured');
      } else {
        req.flash('success_msg', 'Article is added');
        res.redirect('/admin/articles/');
      }
    });
});

router.put('/articles/:id', (req, res) => {
  var id = req.params.id;
  var article = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    article: req.body.article
  };
  Article.findByIdAndUpdate(id, article, {
      new: true
    })
    .then((updatedArticle) => {
      req.flash('success_msg', 'Article updated');
      res.redirect(`/admin/articles/${id}`);
    }).catch((err) => {
      console.log(err);
    });
});

router.delete('/articles/:id', (req, res) => {

  Article.findByIdAndRemove(req.params.id)
    .then((deletedArticle) => {
      req.flash('success_msg', 'Article Deleted');
      res.redirect('/admin/articles');
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/subscribers', (req, res) => {
  Subscriber.find({})
    .then((subscribers) => {
      res.render('admin/subscribers', {
        layout: 'admin',
        subscribers
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.delete('/subscribers/:id', (req, res) => {
  Subscriber.findByIdAndRemove(req.params.id)
    .then((subscriber) => {
      res.redirect('/admin/subscribers');
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/messages', (req, res) => {
  Mail.find({})
    .then((messages) => {
      res.render('admin/messages', {
        layout: 'admin',
        messages
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.delete('/messages/:id', (req, res) => {
  Mail.findByIdAndRemove(req.params.id)
    .then((subscriber) => {
      res.redirect('/admin/messages');
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get('/interact', (req, res) => {
  res.render('admin/interact', {
    layout: 'admin',
  });
});



module.exports = router;
