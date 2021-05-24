const express = require("express");
const mongoose  = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

var items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ashu:Test123@cluster0.trx0j.mongodb.net/todolistDB", { useNewUrlParser: true , useUnifiedTopology: true  });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Buy Food"    
})
const item2 = new Item({
    name: "Cook Food"    
})
const item3 = new Item({
    name: "Eat Food"    
})

const defaultItems  = [item1, item2, item3];

app.get("/", function(req,res){


    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                console.log(err);
            }else{
                 console.log("Succesfully saved default items to DB");
            }
        });
        res.redirect("/");
        }else{
            res.render("list", {kindOfDay: day, newListItems :foundItems})

        }
        
    })
    var tooday = new Date();
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = tooday.toLocaleDateString("en-US", option);
    
    //res.render("list", {kindOfDay: day, newListItems :items})
});


app.post("/", function(req,res){
    const itemName = req.body.newItem;
    //console.log(req.body.newItem);
    //items.push(item);
    const item = new Item({
        name: itemName
    });
    item.save();

    res.redirect("/");
    
})

app.post("/deleteitem", function(req,res){
    //console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    //res.redirect("/deleteitem");
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
           console.log("sucessfully delete checked item") 
            res.redirect("/");
        }
    })

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server started on port 3000");
});
