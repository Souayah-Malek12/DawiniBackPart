const userModel = require("../Models/user")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

    const registreController = async (req, res) => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
            const { fName, lName ,email, password, confirmPassword, role ,phone, address, speciality  } = req.body;
            if (!fName) {
                return res.status(400).send({ success: false, message: "Name is required" });
            }
            if (!lName) {
                return res.status(400).send({ success: false, message: "Name is required" });
            }
            if (!email) {
                return res.status(400).send({ success: false, message: "Email is required" });
            }
            if (!password) {
                return res.status(400).send({ success: false, message: "Password is required" });
            }
            if (!confirmPassword) {
                return res.status(400).send({ success: false, message: "Confirm Password is required" });
            }
            if (!phone) {
                return res.status(400).send({ success: false, message: "Phone number is required" });
            }
            if (!address) {
                return res.status(400).send({ success: false, message: "Address is required" });
            }
            if (!emailRegex.test(email)) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid email format"
                });
            }
            const userExist = await userModel.findOne({ email });
            if (userExist) {
                return res.status(409).send({
                    success: false,
                    message: "This email is already in use"
                });
            }
    
            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Passwords do not match"
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const newUserData =  { fName, lName ,email, password:hashedPassword , role ,phone, address, speciality  }

            if(newUserData.role ==="patient"){
                newUserData.isAcceptedByAdmin = true,
                newUserData.acceptanceDate = Date.now()
            }

            const newUser = await userModel.create(newUserData);

            
            
    
            
            return res.status(201).send({
                success: true,
                message: "User created successfully",
                newUser
            });
    
        } catch (error) {
            console.error("Error in user register Api", error);
            return res.status(500).send({
                success: false,
                message: "Error in user register Api"
            });
        }
    };
    

    const loginController = async(req, res)=>{
        try{
            const {email, password} = req.body;
            const userExist = await userModel.findOne({ email})                                                                                                       
        if(!userExist){
            return res.status(404).send({
                success : false,
                message: "Check your email/password",
            })
        }
        
        const isMatch = await bcrypt.compare(password,  userExist.password)

        if(!isMatch){
            return res.status(401).send({   
                success : false,
                message: "Password do not  match",
                
            })
        }
        const isAccepted = userExist.isAcceptedByAdmin;
        if(!isAccepted){
            return res.status(401).send({
                success : false,
                message : "Please wait until the Admin accept your account"
            })
        }
        const token =  JWT.sign( { id: userExist._id}, process.env.SECRET, {
            expiresIn : '1d'
        })
        
        if(isAccepted){
            return res.status(201).send({
                success : true,
                message : "Logged In Successfully",
                userExist,
                token
            })
        }
        console.log(req.user);

        userExist.password = undefined;
       
        }catch(err){
            console.error("Error in user Login:", err);
        return res.status(500).send({
            success: false,
            message: "Error in login api"
        });
        }
    }


module.exports = {registreController, loginController}