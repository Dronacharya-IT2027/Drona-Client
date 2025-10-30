import Admin from '../models/Admin.js';
import SuperAdmin from '../models/SuperAdmin.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({ name, email, password: hashedPassword, groupMembers: [], absenteeList: [], defaulterList: [] });
        await admin.save();

        const userExist = await User.findOne({ email });
        if(userExist) return res.status(400).json({ message: 'User email already exists' });

        const user = new User({ email, password: hashedPassword, userType: 'admin' });
        await user.save();

        // Add admin to superadmin admin list
        const superAdmin = await SuperAdmin.findOne({ email: req.user.email });
        if(!superAdmin) return res.status(404).json({ message: 'SuperAdmin not found' });

        superAdmin.admins.push(admin._id);
        await superAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAdminLists = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findOne({ email: req.user.email }).populate({
            path: 'admins',
            populate: [{ path: 'groupMembers', select: 'name enrollmentNumber email' },
                { path: 'absenteeList', select: 'name enrollmentNumber email' },
                { path: 'defaulterList', select: 'name enrollmentNumber email' }]
        });

        if(!superAdmin) return res.status(404).json({ message: 'SuperAdmin not found' });

        res.status(200).json({ admins: superAdmin.admins });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
