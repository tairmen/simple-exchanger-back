import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import CrmUser from '../models/crm.user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = new Router();

const jwtSecret = process.env.JWT_SECRET;

router.post('/registration', [
  check('email', 'Invalid Email')
    .isEmail(),
  check('password', 'Password must have minimum 8 character')
    .isLength({ min: 8 })
],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array(),
          message: 'Invalid registration input data'
        });
      }

      const { email, password } = req.body;

      const reqUser = await CrmUser.findOne({ email });

      if (reqUser) {
        return res.status(400).json({ message: 'User with this Email already exist' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const crmUser = new CrmUser({ email, password: hashedPassword });

      await crmUser.save();

      res.status(201).json({ message: 'Account success created' });

    } catch (e) {
      res.status(500).json({ message: 'Registration failed. Try again' });
    }
  });

router.post('/login', [
  check('email', 'Invalid Email').normalizeEmail().isEmail(),
  check('password', 'Invalid password').exists()
],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Invalid authorization data'
        });
      }

      const { email, password } = req.body;

      const crmUser = await CrmUser.findOne({ email });

      if (!crmUser) {
        return res.status(400).json({ message: 'User do`sent exist' });
      }

      const isMatch = await bcrypt.compare(password, crmUser.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: crmUser.id },
        jwtSecret,
        { expiresIn: '365d' }
      );

      res.json({ token, userId: crmUser._id });

    } catch (e) {
      res.status(500).json({ message: 'Login Error' });
    }
  }
  );

export default router;
