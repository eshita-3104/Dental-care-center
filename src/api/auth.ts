import { getAllData } from "./db";
import type { User } from "../types";

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  // Debug: received login attempt
  console.log("Attempting login for:", email);

  const db = await getAllData();

  // Log 2: Is our database object valid? Or is it null?
  console.log("Database object from storage:", db);

  if (!db) {
    console.error("DATABASE NOT FOUND! It's likely not initialized yet.");
    return null;
  }

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  // Log 3: After searching, did we find a user object?
  console.log("Found user:", user);

  return user || null;
};