const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true} );

const articleSchema = {
  title: String,
  content: String
};

const article = mongoose.model(
  'article',
  articleSchema
);

app.get('/articles', function(err, res){
  article.find(function(err, result){
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  })
});



app.listen(3000, () => console.log(`app is listening on port!`))
