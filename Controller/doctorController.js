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






// Controller for finding nearby doctors using KNN

// Fonction pour obtenir les médecins par les paramètres géographiques

async function getDoctorsByGeoParams(req, res) {
  try {
    // Les coordonnées du patient (exemple : [longitude, latitude])
    const patientCoordinates = req.body.coordinates;

    // Vérifier si les coordonnées du patient sont valides
    if (!patientCoordinates || patientCoordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient coordinates. Please provide valid longitude and latitude."
      });
    }

    // Récupérer tous les médecins depuis la base de données
    const doctors = await userModel.find({});
    console.log("Doctors:", doctors);  // Check what is being passed to the KNN model

    // Tableau pour stocker les données valides des médecins
    const doctorData = [];

    // Parcourir les médecins et extraire leurs coordonnées
    doctors.forEach(doc => {
      if (doc && doc.address && doc.address.coordinates && Array.isArray(doc.address.coordinates) && doc.address.coordinates.length === 2) {
        const doctorCoordinates = doc.address.coordinates;
        console.log("Doctor Coordinates:", doctorCoordinates);

        // Vérification stricte pour éviter des coordonnées invalides (undefined)
        if (!doctorCoordinates.includes(undefined)) {
          doctorData.push({ coordinates: doctorCoordinates, doctor: doc });
        } else {
          console.warn("Skipping doctor with invalid coordinates:", doctorCoordinates);
        }
      } else {
        console.warn("Skipping doctor with invalid address or coordinates:", doc);
      }
    });

    // Vérification si nous avons des données valides de médecins
    if (doctorData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid doctors found in the database."
      });
    }

    // Création du modèle KNN avec les coordonnées des médecins
    const knn = new KNN();

    // Ajout des données des médecins au modèle KNN
    doctorData.forEach(doc => {
      knn.addData(doc.coordinates, doc.doctor);  // X: coordonnées, Y: données du médecin
    });

    // Prédiction avec les coordonnées du patient
    const predictions = knn.predict(patientCoordinates, doctorData.length);
    console.log("Predictions:", predictions);

    // Retourner les résultats au client
    res.json({
      success: true,
      message: "Nearby doctors found successfully.",
      data: predictions
    });
  } catch (error) {
    console.error("Error while finding nearby doctors using KNN:", error);

    // Gestion des erreurs
    res.status(500).json({
      success: false,
      message: "Error while finding nearby doctors using KNN",
      error: error.message
    });
  }
}


  
  
  
  

  

  

module.exports = {getAccepteddoctorsAcc, getUnAccepteddoctorsAcc, getDoctorById, getDoctorBySpecialty, getDoctorsByGeoParams}