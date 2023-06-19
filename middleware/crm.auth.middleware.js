import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = (req, res, next) => {
  const url = req.originalUrl || req.url;

  if (!url.includes('/crm/')) {
    return next();
  }

  const unAuthorizeCallBack = () => res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return unAuthorizeCallBack();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    unAuthorizeCallBack();
  }
}
