import { Router } from 'express';
import { auth } from '../middleware/crm.auth.middleware.js';
import Currency from '../models/currency.js';

const router = Router();

router.get('/currencys', auth, async (req, res) => {
  try {
    const currencys = await Currency.find();

    const formResponseData = currencys.map(currency => {
      return {
        id: currency.id,
        symbol: currency.symbol,
        name: currency.name,
        minBuy: currency.minBuy,
        maxBuy: currency.maxBuy,
        minSell: currency.minSell,
        maxSell: currency.maxSell
      }
    })

    res.json(formResponseData);
  } catch (e) {
    res.status(500).json({ message: 'Request error' });
  }
});

router.put('/currencys/:id', auth, async (req, res) => {
  try {
    const currencyId = req.params.id;

    const { minBuy, maxBuy, minSell, maxSell } = req.body;

    const reqCurrency = await Currency.findById(currencyId);

    if (!reqCurrency) {
      return res.status(400).json({ message: 'Currency does`nt exist' });
    }

    if (minBuy) reqCurrency.minBuy = minBuy;
    if (maxBuy) reqCurrency.maxBuy = maxBuy;
    if (minSell) reqCurrency.minSell = minSell;
    if (maxSell) reqCurrency.maxSell = maxSell;

    reqCurrency.save();
    res.status(201).json({ message: 'Update currency success!' })
  } catch (e) {
    res.status(500).json({ message: 'Update currency error' });
  }
});

/** For create currencys
 *  Models for creating on README.md
 **/
  router.post('/currencys', async (req, res) => {
   try {
     const uah = { symbol: "₴", name: "UAH", minBuy: "1000", maxBuy: "10000000", minSell: "1000", maxSell: "10000000" };
     const usd = { symbol: "₽", name: "RUB", minBuy: "500", maxBuy: "5000000", minSell: "500", maxSell: "5000000" }
//    const { symbol, name, minBuy, maxBuy, minSell, maxSell } = req.body;
//     const newCurrency = new Currency({ symbol, name, minBuy, maxBuy, minSell, maxSell });
    const newCurrencyUAH = new Currency({ ...uah });
   await newCurrencyUAH.save();
    const newCurrencyUSD = new Currency({ ...usd });
   await newCurrencyUSD.save();

    res.status(200).json({ message: 'Currency created' });
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Create currency error' });
   }
 });

export default router;
