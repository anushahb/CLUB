import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
  eventName: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String 
  },
  eventPictures: [
    {
      type: String
    }
  ],
  participants: [
    {
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],

  date:{
    type:Date
  },

  // clubOrganizing: { 
  //   type: Schema.Types.ObjectId, 
  //   ref: "Club", 
  //   required: true 
  // },
  eventReport: {
    type: Schema.Types.ObjectId,
    ref: "Report"
  },
  // activityPoints: {
  //   type: Number,
  //   required: true,
  // },

  eventRegistrationDetails:{
    startDate:{
      type:Date,
    },
    endDate:{
      type:Date
    },
    fee:{
      
      type:Number,
      
    },
    clubOrganizing: { 
        type: Schema.Types.ObjectId, 
        ref: "Club", 
        
    },
      activityPoints: {

          type: Number,

    },

  },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
