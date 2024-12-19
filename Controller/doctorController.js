const userModel = require("../Models/user");
const KNN = require('ml-knn');



const getAccepteddoctorsAcc = async(req, res)=>{
    try{
        const doctorsList = await userModel.find({role : "docteur", isAcceptedByAdmin : true})
        return res.status(200).json({
            success: true,
            message: "Doctors List",
            doctorsList
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in getAccepteddoctorsAcc  Api",
            error: err.message,
          });
    }
}

const getUnAccepteddoctorsAcc = async(req, res)=>{
    try{
        const doctorsList = await userModel.find({role : "docteur", isAcceptedByAdmin : false})
        return res.status(200).json({
            success: true,
            message: "Unaccepted Doctors List",
            doctorsList
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in getUnAccepteddoctorsAcc  Api",
            error: err.message,
          });
    }
}

const getDoctorById = async(req, res)=>{
    try{
        const {docId} = req.params;
        const doctor = await userModel.findById(docId);
        return res.status(200).json({
            success: true,
            message: " Doctors ",
            doctor
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in getUnAccepteddoctorsAcc  Api",
            error: err.message,
          });
    }
}

const getDoctorBySpecialty = async(req, res)=>{
    try{
        const {spec} = req.params;
        const doctorsList = await userModel.find({"speciality" : spec});
        return res.status(200).json({
            success: true,
            message: `${spec} Doctors` ,
            doctorsList
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in  getDoctorBySpecialty Api",
            error: err.message,
          });
    }
}








async function getDoctorsByGeoParams(req, res) {
  try {
    const patientCoordinates = req.body.coordinates;

    if (!patientCoordinates || patientCoordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient coordinates. Please provide valid longitude and latitude."
      });
    }
    const doctors = await userModel.find({});
    console.log("Doctors:", doctors);  

    const doctorData = [];

    doctors.forEach(doc => {
      if (doc && doc.address && doc.address.coordinates && Array.isArray(doc.address.coordinates) && doc.address.coordinates.length === 2) {
        const doctorCoordinates = doc.address.coordinates;
        console.log("Doctor Coordinates:", doctorCoordinates);

        //  pour éviter des coordonnées invalides (undefined)
        if (!doctorCoordinates.includes(undefined)) {
          doctorData.push({ coordinates: doctorCoordinates, doctor: doc });
        } }
    });

    if (doctorData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid doctors found in the database."
      });
    }

    // Création du modèle KNN 
    const knn = new KNN();

    // Ajout des données des médecins au modèle KNN
    doctorData.forEach(doc => {
      knn.addData(doc.coordinates, doc.doctor);  // X: coordonnées, Y: données du médecin
    });

    // Prédiction 
    const predictions = knn.predict(patientCoordinates, 5);
    console.log("Predictions:", predictions);
    res.json({
      success: true,
      message: "Nearby doctors found successfully.",
      data: predictions
    });
  } catch (error) {
    console.error("Error while finding nearby doctors using KNN:", error);
    res.status(500).json({
      success: false,
      message: "Error while finding nearby doctors using KNN",
      error: error.message
    });
  }
}


const deleteDoctorControllerById = async(req, res)=>{
  
    try{
        const {docId} = req.params;
        const doctor = await userModel.findByIdAndDelete(docId);
        if(!doctor){
          return res.status(404).json({
            success: false,
            message: "doctor not found ",
            error: err.message,
          });
        }
        const docMail = doctor.email;
        return res.status(200).json({
            success: true,
            message: " Doctor deleted Successfully ",
            docMail
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in deleteDoctorControllerById  Api",
            error: err.message,
          });
    }

}

  

module.exports = {getAccepteddoctorsAcc, getUnAccepteddoctorsAcc, 
  getDoctorById, getDoctorBySpecialty, getDoctorsByGeoParams
, deleteDoctorControllerById
}