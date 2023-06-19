import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crmAuthRoutes from './routes/crm.auth.routes.js';
import currencysRoutes from './routes/currencys.routes.js';
import rangesRoutes from './routes/ranges.routes.js';
import ordersRoutes from './routes/orders.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/crm/auth', crmAuthRoutes);
app.use('/api/crm', currencysRoutes);
app.use('/api', currencysRoutes);
app.use('/api/crm', rangesRoutes);
app.use('/api', rangesRoutes);
app.use('/api/crm', ordersRoutes);
app.use('/api', ordersRoutes);

const PORT = process.env.PORT ?? 8080;
const DB = process.env.MONGO_URI;

const startApp = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
};

startApp();