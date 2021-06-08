require('dotenv').config();
const express = require ('express');
const morgan = require ('morgan');
const cors = require ('cors');
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(cors());

//MongoDB
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const DB_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`
mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
}, (err, res) => {

    if (err) throw new Error(err);
    console.log(`MongoDB Connected: ${res.connection.host}`);
});




//routes
app.use("/api/", routes);
app.get('/',(req,res)=>{
    res.send('test route => home page');
})

//page intouvable
app.use((req , res) => {
    res.status(404).json({
        msg : 'Page introuvable'
    })
    console.log("u 've been here");
})
;
const PORT = process.env.PORT;
app.listen(PORT ,(err) => {
    if (err) throw new Error(err);
    console.log('App is listening on '+PORT +"!");
 
})