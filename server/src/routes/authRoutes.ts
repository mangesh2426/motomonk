import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Admin from '../models/Admin';

const router = express.Router();


// CREATE ADMIN ROUTE
router.post('/create-admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await Admin.create({
      email: 'admin@motomonk.com',
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Admin creation failed',
    });
  }
});


// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      'motomonksecret',
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

export default router;