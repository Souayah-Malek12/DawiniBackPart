const rdvModel = require("../Models/Rdv");

const PasserRendezVousController = async (req, res) => {
  try {
    const { DateRdv } = req.body; 
    const { patientId, doctorId } = req.params; 
    if (!DateRdv ) {
      return res.status(400).json({
        success: false,
        message: "select date",
      });
    }
    const rdv = (await rdvModel.create({ patientId, doctorId, DateRdv}));

    const rdvInfo = await rdvModel
    .findById(rdv._id).populate("doctorId", "fName email", ) .populate("patientId", "lName email").populate("DateRdv")

    res.status(201).json({
      success: true,
      message: "Rendezvous created successfully.",
      rdvInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in PasserRendezVousController api",
      error: error.message,
    });
  }
};

module.exports = { PasserRendezVousController };
