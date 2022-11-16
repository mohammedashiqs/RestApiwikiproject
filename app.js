const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const { urlencoded } = require("body-parser")
const { read } = require("fs")


mongoose.connect("mongodb+srv://ashiq:ychQlgXEMXSlJeaJ@cluster0.otswj4z.mongodb.net/resapiwikiDB", {useNewUrlParser:true})


const articleSchema = {
    title: String,
    content: String
}


const Article = mongoose.model("Article", articleSchema);

const app = express()

app.use(bodyParser.urlencoded({extended:true}))


//////////////////////////////////////////////Request Targeting all Articles//////////////////////////////

app.route("/articles")
    .get(function(req,res){
        Article.find({},function(err, foundArticles){
            if(!err){
                res.send(foundArticles)
            }else{
                res.send(err)
            }
        })
    })
    .post(function(req, res){
        console.log(req.body.title);
        console.log(req.body.content);


        const newArticles = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticles.save(function(err){
            if(!err){
                res.send("Successfully added new article")
            }else{

            }
        })

    })
    .delete(function(){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted everything")
            }else{
                res.send("not deleted "+err)
            }
        })
    })




app.route("/articles/:articleTitle")

    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, result){
            if(result){
                res.send(result)
            }else{
                res.send("No artcles matching that title was found")
            }
        });
    })

    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: false},
            function(err){
                if(!err){
                    res.send("Successfuly updated article");
                }
            }
        );
    })

    .patch(function(req, res){
        console.log(req.body)
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},  //ivide kodukkonna field/value mathre update aaku eg:- {title:"hello"}
            function(err){
                if(!err){
                    res.send("Successfully updated article")
                }else{
                    res.send(err);
                }
            }
            );
    })




    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted")
                }else{
                    res.send(err)
                }
            }
        );
    });




app.listen(3000, ()=>{
    console.log("Server is started on port 3000")
});