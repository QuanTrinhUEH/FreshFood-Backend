import mongoose from "mongoose";
import { config } from "dotenv";

config();

class DatabaseService {
  constructor() {
    this.uri = process.env.BASE_URI;
  }
  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log(`MongoDB connect successfully`);
    } catch (e) {
      throw (
        {
          message: e.message || e,
          status: 500,
          data: null
        }
      )
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
