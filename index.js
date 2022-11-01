const  express = require ("express")
const cors =  require ("cors")
const mongoose = require ("mongoose")
const dotenv = require('dotenv')
const path = require("path");




const app = express()
app.use(express.json())
//app.use(express.urlencoded())
var bodyParser = require('body-parser');
app.use(cors())

const colors = require("colors");

app.use(bodyParser.json());


dotenv.config({ path: "config/config.env" });


const connectDB = require("./config/db");
connectDB()




//Serve static assets if in production

if(process.env.NODE_ENV === 'production'){

    //Set static folder
    app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));

    app.get('/', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}







//User Schema Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)




//API Post
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

const PORT = 4001 ||  process.env.PORT;

 app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);











