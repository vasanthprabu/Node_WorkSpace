const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const ticketmasterRoutes = require('./api/routes/ticketmaster');
const resolutionhistory = require('./api/routes/resolutionhistory');
const ticketmasterChartsRoutes = require('./api/routes/ticketmastercharts');
const downloadapi = require('./api/routes/downloadall');
const downloadsummary = require('./api/routes/downloadsummary');
const maintenance = require('./api/routes/maintenance');
const bugreport = require('./api/routes/bugreport');
const ADODB = require('node-adodb');
var cors = require('cors')

//logging enabled
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())
//Routes starts here
//mongo connection

mongoose.connect("mongodb://localhost:27017/klanmarketplace");
mongoose.Promise = global.Promise;

app.use('/api/ticketmaster',ticketmasterRoutes);
app.use('/api/resolutionhistory',resolutionhistory);
app.use('/api/chartsapi',ticketmasterChartsRoutes);
app.use('/api/downloadallapi',downloadapi);
app.use('/api/downloadsummaryapi',downloadsummary);
app.use('/api/maintenance',maintenance);
app.use('/api/bugreport',bugreport);
// app.use(express.static(__dirname+'/build'));
// app.get('/*',(req,res)=>{
//     res.sendFile(path.join(__dirname+'/build/index.html'));
// });
//Cross Orgin Resource Sharing Setting Here
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-with,Content-Type,Accept,Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET');
        res.status(200).json({})
    }
    next();
})


//Error handling
app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status(404);
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports = app;