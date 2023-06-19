import { Router } from 'express';
import { auth } from '../middleware/crm.auth.middleware.js';
import Range from '../models/range.js';

const router = Router();

router.get('/ranges', auth, async (req, res) => {
  try {
    const ranges = await Range.find();

    const formResponseData = ranges.map(range => {
      return {
        id: range.id,
        rangeStart: range.rangeStart,
        rangeEnd: range.rangeEnd,
        valueBuyUSD: range.valueBuyUSD,
        valueSellUSD: range.valueSellUSD
      }
    });

    res.json(formResponseData);
  } catch (e) {
    res.status(500).json({ message: 'Request error' });
  }
});

router.post('/ranges', auth, async (req, res) => {
  try {
    const { rangeStart, rangeEnd, valueBuyUSD, valueSellUSD } = req.body;

    const reqRange = await Range.findOne({ rangeStart, rangeEnd });

    if (reqRange) {
      return res.status(400).json({ message: 'This range already exist' });
    }

    const newRange = new Range({ rangeStart, rangeEnd, valueBuyUSD, valueSellUSD });

    await newRange.save();

    const ranges = await Range.find();

    const formResponseData = ranges.map(range => {
      return {
        id: range.id,
        rangeStart: range.rangeStart,
        rangeEnd: range.rangeEnd,
        valueBuyUSD: range.valueBuyUSD,
        valueSellUSD: range.valueSellUSD
      }
    });

    res.status(201).json({ message: 'Range created successfully', ranges: formResponseData });
  } catch (e) {
    res.status(500).json({ message: 'Range create error'})
  }
});

router.put('/ranges/:id', auth, async (req, res) => {
  try {
    const rangeId = req.params.id;

    const { valueBuyUSD, valueSellUSD } = req.body;

    const reqRange = await Range.findById(rangeId);

    if (!reqRange) {
      return res.status(400).json({ message: 'This range dose`nt exist' });
    }

    reqRange.valueBuyUSD = valueBuyUSD;
    reqRange.valueSellUSD = valueSellUSD;

    await reqRange.save();

    const ranges = await Range.find();

    const formResponseData = ranges.map(range => {
      return {
        id: range.id,
        rangeStart: range.rangeStart,
        rangeEnd: range.rangeEnd,
        valueBuyUSD: range.valueBuyUSD,
        valueSellUSD: range.valueSellUSD
      }
    });

    res.json({ message: 'Range successfully updated', ranges: formResponseData });
  } catch (e) {
    res.status(500).json({ message: 'Range update error' });
  }
});

router.delete('/ranges/:id', auth, async (req, res) => {
  try {
    const rangeId = req.params.id;

    const deletedRange = await Range.findByIdAndDelete(rangeId);

    if (!deletedRange) {
      return res.status(400).json({ message: 'This range dose`nt exist' });
    }

    const ranges = await Range.find();

    const formResponseData = ranges.map(range => {
      return {
        id: range.id,
        rangeStart: range.rangeStart,
        rangeEnd: range.rangeEnd,
        valueBuyUSD: range.valueBuyUSD,
        valueSellUSD: range.valueSellUSD
      }
    });

    res.status(201).json({ message: 'Delete range success', ranges: formResponseData });
  } catch (e) {
    return res.status(500).json({ message: 'Delete range error' });
  }
});

export default router;
