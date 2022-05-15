// jsshift esversion:12

const express = require('express')
const parser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')
const date =require(__dirname+'/date.js')
const app = express()


app.set("view engine","ejs");
app.use(parser.urlencoded({extended:true}));
app.use(express.static("public"));

// ================ Connecting to databases =======================
// mongoose.connect("mongodb://localhost:27017/TODOlistDB",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://admin-utkristi-io:Utkarsh%40123@cluster0.7dcrz.mongodb.net/TODOlistDB",{useNewUrlParser: true});
// ------------ Schema ------------
const itemSchema = mongoose.Schema({
   name : String
});
// --------Collection Creation ------
const newItemList = mongoose.model("newItem",itemSchema);
const workItemList = mongoose.model("workItem",itemSchema);
// ------- Ex Object Creation -------
const item1 = new newItemList({
    name:"Welcome to your todo-list"
});
const item2 = new newItemList({
    name:"Hit + button to add the Item"
});
const defaultItem = [item1,item2];

newItemList.count((err,count)=>{
    if(!err && count===0){
        newItemList.insertMany(defaultItem , (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Sucess save");
            }
        });
    }
})

// workItemList.count((err,count)=>{
//     if(!err && count===0){
//         workItemList.insertMany(defaultItem , (err)=>{
//             if(err){
//                 console.log(err);
//             }else{
//                 console.log("Sucess save");
//             }
//         });        
//     }
// })

// =============== Custom List ======================
const listSchema = mongoose.Schema({
    name: String,
    items : [itemSchema]
});
const list = mongoose.model("List",listSchema);



//================ Actions ==========================
var currentDay = date.getDate();
// var newItem =[];
// var workList = [];



app.get('/',(req,res)=>{
    newItemList.find({},(error,items)=>{
        res.render('list',{listTitle: "Home", Item:items});
    })
})

app.post('/',(req,res)=>{
   
    var nItem = req.body.item;
    var nlist = req.body.list;
    if(nItem!==""){
        const newItem = new newItemList({
            name:nItem
        })
        if(nlist==="Home"){
            newItem.save();
            res.redirect('/');
        }else{
             list.findOne({name : nlist},(err,fList)=>{
                fList.items.push(newItem);
                fList.save();
             });
            var rdpage = '/'+nlist;
            res.redirect(rdpage);
        }    
    }
    else{
        if(nlist=="Home"){
            res.redirect('/');
        }
       else{
        var rdpage = '/'+nlist;
        res.redirect(rdpage);
       }    
    }
})

// ============ For New Custom lists ===============

app.get('/:lists',(req,res)=>{
    const listName = _.capitalize(req.params.lists);
    if(listName==="About"){
        res.render('about.ejs',{listTitle:"About"});
    }
    list.findOne({name : listName},(err,result)=>{
        if(err){
            console.log(err);  
        }
        else{
            if(!result){
                const listMember = new list({
                    name : listName,
                    items : defaultItem 
                });
                listMember.save();
                res.render('list',{listTitle:listName , Item:listMember.items});
            }
            else{ 
               res.render('list',{listTitle:listName , Item:result.items}); 
            }
        }
    });

});

// =================================================


// app.get('/work',(req,res)=>{
//     workItemList.find({},(error,items)=>{
//         res.render('list',{listTitle:"WorkList" , Item:items});
//     })
// })

// =============== Delete Items ======================
app.post('/delete',(req,res)=>{
  const to_delete= req.body.item_checkbox;
  const listname = req.body.listName;

  if(listname==="Home"){
    newItemList.findByIdAndRemove(to_delete, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Sucessfully Deleted");
           res.redirect('/');
        }
    })
  }
  else
  {
    list.findOneAndUpdate({name:listname},{$pull:{items:{_id:to_delete}}},function(err,flist){
        if(!err){
            res.redirect("/"+listname);
        }
    })
  }
});

// ================================================
app.get('/about',(req,res)=>{
    res.render('about.ejs',{listTitle:"About"});
})

app.listen(process.env.PORT||305 , ()=>{
    console.log('Running on PORT:305');
})













// if(req.body.list!=="WorkList"){res.redirect("/");}
// else{
//     if(nItem!==""){
//       const newItemWL= new workItemList({
//         name:nItem
//       });
//        newItemWL.save();
//         // workList.push(nItem);
//     }
//     res.redirect("/work");
// }