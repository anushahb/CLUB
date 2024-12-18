import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
  method: { 
    type: String, 
    enum: ["GooglePay", "Paytm", "PhonePay", "Others"], 
    // required: true 
  },
  paidFor: {
    type: String,
    enum: ["Club", "Event"]
  },
  amount: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String 
  },
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);
