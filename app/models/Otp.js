import mongoose from "mongoose";

const schema = mongoose.Schema({
    otp: {type: Number, required: true},
    email: {type: String,  required: true},
    otp_used: {type: Boolean, required: true, default: false}
},
{timestamps: true}
)

export default mongoose.models.Otp || mongoose.model("Otp",schema)