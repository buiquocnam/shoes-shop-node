import dotenv from "dotenv";
import mongoose from "mongoose";
import User, { Role } from "./models/User";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    const adminData = {
      email: "admin@example.com",
      password: "admin123456",
      name: "Admin User",
      role: Role.ADMIN,
      status: true,
    };

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("Admin user already exists:", adminData.email);
      await mongoose.connection.close();
      return;
    }

    const admin = await User.create({
      email: adminData.email,
      name: adminData.name,
      password: hashedPassword,
      role: adminData.role,
      status: adminData.status,
    });

    console.log("✅ Admin user created successfully:");
    console.log("Email:", admin.email);
    console.log("Name:", admin.name);
    console.log("Role:", admin.role);
    console.log("Status:", admin.status);
    console.log("ID:", admin.id);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

main();
