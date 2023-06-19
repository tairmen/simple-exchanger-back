import { Schema, model } from 'mongoose';

const schema = new Schema({
  rangeStart: { type: String, require: true },
  rangeEnd: { type: String, require: true },
  valueBuyUSD: { type: String, require: true },
  valueSellUSD: { type: String, require: true }
});

export default model('Range', schema);
