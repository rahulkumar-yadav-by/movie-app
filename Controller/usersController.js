const bcrypt = require("bcrypt") // using this for dcrypting the password
const jwt = require("jsonwebtoken") // generating the token key and verifying the token key
const UserModel = require("../Models/users") // for CURD Operations

// Saving the User
// request from client 
// response from server
// next for next steps (we can treat as break... or continue)
const create = (req, res, next) => {
    UserModel.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    },(error, result) => {
        if(error){  next(error);  }
        res.status(200).json({message:"User Added Successfully!!!",data:result})
    })
}

const login=(req,res,next)=>{
    UserModel.findOne({email:req.body.email},(err,result)=>{
        if(err){next(err);}
        else{
            if(bcrypt.compareSync(req.body.password,result.password,null)){
                //generating the token using jwt.sign()
                //3 parameters
                //   1. claims
                //  2. secret key
                //  3. expiert time of token
               const token = jwt.sign(
                            {
                                id:result._id,
                            },
                            req.app.get("secret_key"),
                            {
                                expiresIn:"1H"
                            }
                        );
                res.status(200).json({message:"Sussessfully Loggeg in",data:{user:result,token:token}});
               

            }
        }
    })
}



// Export
module.exports = {create,login};
