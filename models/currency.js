import { Schema, model } from 'mongoose';

const schema = new Schema({
  symbol: { type: String, require: true },
  name: { type: String, require: true },
  minBuy: { type: String, require: true },
  maxBuy: { type: String, require: true },
  minSell: { type: String, require: true },
  maxSell: { type: String, require: true }
});

export default model('Currency', schema);
