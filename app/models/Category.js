import mongoose from "mongoose";

const schema = mongoose.Schema({
    name :{
        type: String,
        require: true,
        unique: true,
    }
})

export default mongoose.models.Category || mongoose.model("Category",schema)