import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
  event: { 
    type: Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  pictures: [
    {
      type: String
    }
  ],
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
