const mongoose = require("mongoose");

const orderSequenceSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      required: true,
      unique: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderSequence", orderSequenceSchema);
