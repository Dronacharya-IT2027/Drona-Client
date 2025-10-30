import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    absenteeList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    defaulterList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

export default mongoose.model('Admin', adminSchema);
