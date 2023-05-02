const express = require('express');
const app = express();

const producRouter =require('./route/productRoute')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use('/',express.static('uploads'))

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


app.use('/product',producRouter)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

const userRoute = require('./route/userRoute')
app.use('/user',userRoute)


const update=require('./route/updateprod')
app.use('/',update)
app.get("/",(req,res) =>{
    res.send("hello express")
})


app.listen(8000, () => {
    console.log('Server started on port 8000');
  });