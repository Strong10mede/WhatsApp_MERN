// import mongoose from 'mongoose';
import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

//collection - messageContent is a table or collection
export default mongoose.model("messagecontents", whatsappSchema);
// module.exports = mongoose.model("messagecontents", whatsappSchema); both are same
