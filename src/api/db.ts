// src/api/db.ts
import localforage from 'localforage';
import { initialData } from './mockData';

const DB_KEY = 'dentalCenterData';

export const initializeDatabase = async () => {
  try {
    const data = await localforage.getItem(DB_KEY);
    if (!data) {
      console.log('Initializing database with mock data...');
      await localforage.setItem(DB_KEY, initialData);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const getAllData = async () => {
  try {
    return await localforage.getItem<typeof initialData>(DB_KEY);
  } catch (error) {
    console.error("Error fetching all data:", error);
    return null;
  }
};

export const updateDatabase = async (newData: typeof initialData) => {
  try {
    await localforage.setItem(DB_KEY, newData);
  } catch (error) {
    console.error("Error updating database:", error);
  }
};