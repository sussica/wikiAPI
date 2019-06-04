const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const article = mongoose.model(
  'article',
  articleSchema
);

app.route('/articles')
  .get(function(err, res) {
    article.find(function(err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    })
  })

  .post(function(req, res) {
    const newAriticle = new article({
      title: req.body.title,
      content: req.body.content
    });

    newAriticle.save(function(err) {
      if (!err) {
        res.send('Successfully added a new article!')
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    article.deleteMany(function(err) {
      if (!err) {
        res.send('Successfully deleted');
      } else {
        res.send(err);
      }
    })
  });

app.route('/articles/:articleTitle')
  .get(function(req, res) {
    article.findOne({
      title: req.params.articleTitle
    }, function(err, result) {
      if(result){
        res.send(result);
      }else{
        res.send('No article found');
      }
    })
  })
.put(function(req, res){
  article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send('Successfully updated my article');
      }else{
        res.send(err);
      }
    }
  )
})
.patch(function(req, res){
  article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send('Successfully updated my article');
      }else{
        res.send(err);
      }
    }
  )
})
.delete(function(req, res){
  article.deleteOne({
    title:req.params.articleTitle
  },
  function(err){
    if(!err){
      res.send('Successfully delete');
    }else{
      res.send(err);
    }
  })
});


app.listen(3000, () => console.log(`app is listening on port!`))
