const userModel = require("../Models/user");

const acceptDocteur = async (req, res)=>{
    try{
        const {accId} = req.params;
        const userExist = await userModel.findOne({_id: accId});
        userExist.isAcceptedByAdmin = true;
        userExist.acceptanceDate = Date.now();
        await userExist.save()
        return res.status(200).json({
            success: true,
            message: "doctor-account accepted",
            userExist
          });
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in Accept doctor  Api",
                error: err.message,
              });
        }
    
}



module.exports = {acceptDocteur}