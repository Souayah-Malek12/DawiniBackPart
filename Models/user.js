const {mongoose} = require('mongoose');

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true,
      },
      lName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["patient", "admin", "docteur"],
        default: "patient",
      },
      phone : {
        type :Number
      },
      address: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }  // [longitude, latitude]
      },
      speciality : {
        type: String,
        required: function(){ return this.role ==="docteur"} 
        
      },
      isAcceptedByAdmin: {
        type: Boolean,
        default : false
     },
    acceptanceDate : {
        type: Date,
        default : null
    },
    isAdmin : {
      type: Boolean, 
      default : false
    }
},{ timestamps: true })

userSchema.index({ address: '2dsphere' });

module.exports = mongoose.model('user', userSchema)