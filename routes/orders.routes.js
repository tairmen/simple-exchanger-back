import { Router } from 'express';
import { auth } from '../middleware/crm.auth.middleware.js';
import Order from '../models/order.js';

const router = Router();

router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find();

    const formResponseData = orders.map(order => {
      return {
        id: order.id,
        status: order.status,
        currencyToBuyId: order.currencyToBuyId,
        currencyToBuyName: order.currencyToBuyName,
        currencyToSellId: order.currencyToSellId,
        currencyToSellName: order.currencyToSellName,
        value: order.value,
        email: order.email,
        telephone: order.telephone,
        uuid: order.uuid,
        createdAt: order.createdAt
      }
    });

    res.json(formResponseData);
  } catch (e) {
    res.status(500).json({ message: 'Get orders error' });
  }
});

router.post('/orders', auth, async (req, res) => {
  try {
    const { currencyToBuyId, currencyToBuyName, currencyToSellId, currencyToSellName, value, email, telephone } = req.body;

    const status = 'pending';
    const createdAt = new Date().getTime();

    const uuid = Math.floor(Math.random() * 10000000);

    const newOrder = new Order({
      status,
      currencyToBuyId,
      currencyToBuyName,
      currencyToSellId,
      currencyToSellName,
      value,
      email,
      telephone,
      uuid,
      createdAt: createdAt.toString()
    });

    const order = await newOrder.save();

    res.status(201).json({ message: `Заказ №${order.id.slice(0,6)} создан успешно!` })
  } catch (e) {
    res.status(500).json({ message: 'Order create error' });
  }
});

router.put('/orders/:id', auth, async (req, res) => {
  try {
    const orderId = req.params.id;

    const reqOrder = await Order.findById(orderId);

    if (!reqOrder) {
      return res.status(400).json({ message: 'This order dose`nt exist' });
    }

    const newStatus = req.body.status;

    if (newStatus !== 'approve' && newStatus !== 'reject') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    reqOrder.status = newStatus;
    reqOrder.save();

    const orders = await Order.find();

    const formResponseData = orders.map(order => {
      return {
        id: order.id,
        status: order.status,
        currencyToBuyId: order.currencyToBuyId,
        currencyToBuyName: order.currencyToBuyName,
        currencyToSellId: order.currencyToSellId,
        currencyToSellName: order.currencyToSellName,
        value: order.value,
        email: order.email,
        telephone: order.telephone,
        uuid: order.uuid,
        createdAt: order.createdAt
      }
    });

    res.status(201).json({ message: 'Update status success', orders: formResponseData });
  } catch (e) {
    res.status(500).json({ message: 'Status update error' });
  }
});

router.delete('/orders/:id', auth, async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(400).json({ message: 'This order dose`nt exist'});
    }

    const orders = await Order.find();

    const formResponseData = orders.map(order => {
      return {
        id: order.id,
        status: order.status,
        currencyToBuyId: order.currencyToBuyId,
        currencyToBuyName: order.currencyToBuyName,
        currencyToSellId: order.currencyToSellId,
        currencyToSellName: order.currencyToSellName,
        value: order.value,
        email: order.email,
        telephone: order.telephone,
        uuid: order.uuid,
        createdAt: order.createdAt
      }
    });

    res.status(201).json({ message: 'Order delete successfully', orders: formResponseData });
  } catch (e) {
    res.status(500).json({ message: 'Delete order error' });
  }
});

export default router;
