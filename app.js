
// requires the packages needed to compile the website
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


// initializes the express module required above
const app = express();

// sets up the viewport of the page to accept ejs, this allows us to use the <%= %> in order to create a custom name that we can use here in app js, acting like an identifier
app.set("view engine", "ejs");

// initializes body parser in order for us to pick-up parts html elements by name which acccept also integers
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// connects to the local mongoose host
mongoose.connect("mongodb+srv://Fanush:Test123@cluster0.awfs3xl.mongodb.net/todolistDB", {useNewUrlParser: true});
// creates the schema for the items from the new collection
const itemsSchema = {
    name: String
};
const listSchema = {
  name: String,
  items: [itemsSchema]
};
// creates the blueprint that includes first the path("item") along with the blueprint on what the items should contain
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);
// new items created using the scheme from above
const item1 = new Item({name: "Take your vitamins."});
const item2 = new Item({name: "Go to work."});
const item3 = new Item({name: "Buy groceries."});
// array containing the items created above
const defaultItems = [item1, item2, item3];

// starts the homepage of the website
app.get("/", function(req, res) {
  Item.find(function(err, item){
    if(item.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Item successfully added to the DB.");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {
        listTitle: "Today", // kindOfDay was defined in list and is now equal to day
        newListItems: item
      });
    }
  });
// res.render is part of the express js package, and in this case, it basically says, take the kindOfDay & newListItems elements from the "list" defined as the first parameter and equal them to the input from app.js


});
app.get("/:paramName", function(req, res){
  const currentRoute = _.capitalize(req.params.paramName);
  List.findOne({name: currentRoute}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: currentRoute,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + currentRoute);
      }else{
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});

// here we have the post method called in list.ejs with the form element
app.post("/", function(req, res) {
  const itemName = req.body.newItem; // using body-parser, it takes the input from the user and sets it to a local post variable;
  const listItem = req.body.list;
  const item = new Item({
    name: itemName
  });
  if(listItem === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listItem}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listItem);
    })
  }

});

app.post("/delete", function(req,res){
 const checkedItemId = req.body.checkbox;
 const listName = req.body.listName;

 if(listName === "Today"){
   Item.findByIdAndRemove({_id: checkedItemId}, function(err){
     if(err){
       console.log(err);
     }else{
       res.redirect("/");
       console.log("Item succesfully deleted.");
     }
   });
 }else{
   List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
     if(!err){
       res.redirect("/"+ listName);
     }
   });
 }

});

app.listen(process.env.PORT ||3000, function() {

  console.log("rolling on port 3000...");
})
