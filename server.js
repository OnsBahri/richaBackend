const express = require ('express');
const morgan = require ('morgan');
const cors = require ('cors');

const app = express();
require('dotenv').config({
    path : './config/index.env'
});

app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(cors());

app.get('/', function (req,res){
    res.send('test route => home page');
})

//page intouvable
app.use(function (req , res){
    res.status(404).json({
        msg : 'Page introuvable'
    })
})
const PORT = process.env.PORT;
app.listen(PORT , function(){
    console.log('App is listening on '+PORT);
})