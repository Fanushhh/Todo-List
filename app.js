
// requires the packages needed to compile the website
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");


// created an array called 'items' to store the user input
const items = ["Buy food.","Buy water.", "Go for a run."];
const workItems = [];
// initializes the express module required above
const app = express();

// sets up the viewport of the page to accept ejs, this allows us to use the <%= %> in order to create a custom name that we can use here in app js, acting like an identifier
app.set("view engine", "ejs");

// initializes body parser in order for us to pick-up parts html elements by name which acccept also integers
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// starts the homepage of the website
app.get("/", function(req, res) {

const day = date.getDate();

// res.render is part of the express js package, and in this case, it basically says, take the kindOfDay & newListItems elements from the "list" defined as the first parameter and equal them to the input from app.js
  res.render("list", {
    listTitle: day, // kindOfDay was defined in list and is now equal to day
    newListItems: items
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});
app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.get("/about", function(req,res){
  res.render("about");
})
// here we have the post method called in list.ejs with the form element
app.post("/", function(req, res) {
  item = req.body.newItem; // using body-parser, it takes the input from the user and sets it to a local post variable;
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work")
  }else{
    items.push(item); // pushes that variable to the global array called "items" using the items.push command
    res.redirect("/"); // redirects back to the homepage with the updated information
  }
})









app.listen(3000, function() {

  console.log("rolling on port 3000...");
})
