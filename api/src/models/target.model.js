import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let TargetSchema = new Schema({
  name: {type: String, required: true, max: 100},
  topLeft: {type: Number, required: true},
  topRight: {type: Number, required: true},
  bottomLeft: {type: Number, required: true},
  bottomRight: {type: Number, required: true},
});

export default mongoose.model('Target', TargetSchema);