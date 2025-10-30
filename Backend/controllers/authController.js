import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import SuperAdmin from '../models/SuperAdmin.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Manas' });

    // Need to lookup the password hash from the corresponding collection:
    let account;
    if (user.userType === 'student') account = await Student.findOne({ email });
    if (user.userType === 'admin') account = await Admin.findOne({ email });
    if (user.userType === 'superadmin') account = await SuperAdmin.findOne({ email });

    if (!account) return res.status(400).json({ message: 'User account not found' });

    const valid = await bcrypt.compare(password, account.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, userType: user.userType});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
