import mongoose from 'mongoose';

const superAdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }]
});

export default mongoose.model('SuperAdmin', superAdminSchema);
