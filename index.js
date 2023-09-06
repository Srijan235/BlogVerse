const express = require("express");
const app= express();


const { default: mongoose } = require("mongoose");
const User= require("./models/User");
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const salt = bcrypt.genSaltSync(10);
const secret = 'srijan1234shahi';

const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const fs = require('fs');
const Post = require("./models/post");



app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));






mongoose.connect('mongodb+srv://srijans235:Gc0DXLiWyTvjCzyv@cluster0.2mxtuvk.mongodb.net/?retryWrites=true&w=majority');

app.post('/register',async(req,res)=>{
    const {username,password}= req.body;
    try{
        const hash =bcrypt.hashSync(password, salt);
        const userDoc = await User.create({
            username,
            password: hash
        });

        res.json(userDoc);
    } catch(e){
        res.status(400).json(e);
    }
  
});


app.post('/login',async(req,res)=>{
    const {username,password}= req.body;
    try{
      const userDoc = await User.findOne({username});
      const passOk = bcrypt.compareSync(password, userDoc.password);
      
      if(passOk){
        //ok
         jwt.sign({username,id: userDoc._id},secret,{},(err,token)=>{
               if(err) throw err;
               res.cookie('token',token).json({
                   id: userDoc._id,
                   username,
               });
               //res.json(token);
        });
      }
      else{
        res.status(400).json('Wrong Credintials!!')
      }

    } catch(e){
        res.status(400).json(e);
    }
  
});

  app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });

  // app.get('/logout',(req,res)=>{
  //   res.cookie('token','').json('ok');
  // });

  app.post('/logout', (req,res) => {
    res.cookie('token',null).json('ok');
  });

//mongodb+srv://srijans235:Gc0DXLiWyTvjCzyv@cluster0.2mxtuvk.mongodb.net/?retryWrites=true&w=majority
//Gc0DXLiWyTvjCzyv

app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
  const {originalname} = req.file;
  const parts = originalname.split('.');
  const ext= parts[parts.length - 1];
  const {path} =req.file;
  const newPath = path+'.'+ext
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async(err,info) => {
    if (err) throw err;

    const {title,summary,content} = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover : newPath,
      author : info.id,
  
    });
  
  
    res.json(postDoc);

   
  });
 
 
// console.log(title,summary,content);
});
  
app.get('/post', async(req,res)=>{
    const posts = await Post.find()
    .populate('author',['username'])
    .sort({createdAt : -1})
    .limit(10);
   // console.log(posts);
    res.json(posts);
})

app.get('/post/:id',async(req,res)=>{
const {id}=req.params;
   const postDoc = await Post.findById(id).populate('author',['username']);

  res.json(postDoc);
})

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});

app.listen(4000,()=>{
    console.log("Server is Running at 4000");
});