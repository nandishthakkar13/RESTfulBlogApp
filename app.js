var express = require("express");

app = express();

var bodyParser = require("body-parser");

var methodOverride = require("method-override");

var expressSanitizer = require("express-sanitizer");

var mongoose =  require("mongoose"); 

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify',false);

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method") );
//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});


var Blog = mongoose.model("Blog",blogSchema);
/*
Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80",
    body: "This is a testing blog",
})*/

//RESTFUL ROUTES

app.get("/", (req,res) => {
    res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs", (req,res) => {
    Blog.find({}, (err,blogs) => {
        if(err){
            console.log("ERROR!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
 
})

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
})

//POST ROUTE (CREATE)
app.post("/blogs",(req, res) => {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        }
        else{
            //redirect to the index pages
            res.redirect("/");
        }
    });
    
})

//SHOW ROUTE
app.get("/blogs/:id",(req,res) => {
    Blog.findById(req.params.id, (err,foundblog) => {
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundblog});
        }
    });
    
})

//EDIT ROUTE

app.get("/blogs/:id/edit", (req,res) => {
    Blog.findById(req.params.id, (err,foundblog) =>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundblog});         
        }
    });
   
})

//UPDATE ROUTE
app.put("/blogs/:id", (req,res)=>{

    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, (err,updatedblog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
    
   
})

// DELETE ROUTE
app.delete("/blogs/:id", (req,res)=> {
   
    Blog.findByIdAndRemove(req.params.id, (err) => {

        if(err){
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000,() => {
    console.log("Listening on server");
})