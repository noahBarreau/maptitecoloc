import dotenv from "dotenv";
import { connectMySQLDB } from "./configs/databases/mysql.config";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

Promise.all([
  connectMySQLDB.initialize(),
]).then(() => {
  console.log("Connected to MySQL and MongoDB!");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to initialize databases:", error);
  process.exit(1);
});