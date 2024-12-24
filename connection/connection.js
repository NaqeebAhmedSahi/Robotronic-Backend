
const express = require("express");
const mongoose = require("mongoose");

const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(process.env.MONGO_URL);
      console.log(`Successfully connected to mongoDb`);
    } catch (error) {
      console.log(error);
    }
  };
  module.exports = connectToMongo;