const mongoose = require('mongoose');
const maintenanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: { type: String, required: true },
    Object_Name: { type: String, required: true },
    Object_Key: { type: String, required: true },
    Object_Value: { type: String, required: true },
    Object_User: { type: String, required: true },
    Object_Date:{ type: String,required: true }
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);