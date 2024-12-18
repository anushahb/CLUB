import mongoose, { Schema } from "mongoose";


// const clubRegistrationDetails=new Schema({
//   startDate:{
//     type:Date,
//   },
//   endDate:{
//     type:Date
//   },
//   fee:{
//     type:Number,
    
//   }
// })

// const ClubReg=mongoose.model("ClubReg",clubRegistrationDetails)

const clubSchema = new Schema({
  clubName: { 
    type: String,
    required: true,
    unique: true 
  },
  description: { 
    type: String 
  },
  coverImage: {
    type: String,
  },
  president: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    
  },
  members: [
    {
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],
  events: [
    {
      type: Schema.Types.ObjectId, 
      ref: "Event" 
    }
  ],
  clubRegistrationDetails:{
    startDate:{
      type:Date,
    },
    endDate:{
      type:Date
    },
    fee:{
      
      type:Number,
      
    }
  },
}, { timestamps: true });



clubSchema.methods.getPresidentByClubName = async function (clubName) {
  // Find the club and populate the president field
  const club = await Club.findOne({ clubName }).populate("president", "userName");
  console.log(club)
  return club?.president?.userName;
};

export const Club = mongoose.model("Club", clubSchema);
