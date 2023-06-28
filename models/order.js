import { Schema, model } from 'mongoose';

const schema = new Schema({
  status: { type: String, require: true },
  currencyToBuyId: { type: String, require: true },
  currencyToBuyName: { type: String, require: true },
  currencyToSellId: { type: String, require: true },
  currencyToSellName: { type: String, require: true },
  value: { type: String, require: true },
  email: { type: String, require: true },
  telephone: { type: String, require: true },
  createdAt: { type: String, require: true },
  uuid: { type: String, require: true }
});

export default model('Order', schema);
