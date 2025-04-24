import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
import clientPromise from './src/lib/mongodb.js';

const students = [
  { name: "Ahmed Khan", age: 21, dept: "CS", gpa: 3.7 },
  { name: "Fatima Ali", age: 23, dept: "Math", gpa: 3.9 },
  { name: "Muhammad Hassan", age: 20, dept: "Physics", gpa: 3.5 },
  { name: "Ayesha Malik", age: 22, dept: "CS", gpa: 3.8 },
  { name: "Omar Ahmed", age: 24, dept: "Electrical", gpa: 3.2 },
  { name: "Zainab Iqbal", age: 21, dept: "Math", gpa: 3.6 },
  { name: "Bilal Raza", age: 26, dept: "Physics", gpa: 3.3 },
  { name: "Saira Hussain", age: 22, dept: "CS", gpa: 3.4 },
  { name: "Faisal Mahmood", age: 23, dept: "Mechanical", gpa: 2.9 },
  { name: "Hira Imran", age: 25, dept: "Math", gpa: 3.1 },
  { name: "Ali Azam", age: 19, dept: "CS", gpa: 2.8 },
  { name: "Sana Parvez", age: 27, dept: "Physics", gpa: 3.9 },
  { name: "Usman Butt", age: 20, dept: "Civil", gpa: 2.6 },
  { name: "Mahnoor Rashid", age: 24, dept: "CS", gpa: 3.5 },
  { name: "Hamza Chaudhry", age: 22, dept: "Math", gpa: 3.7 },
  { name: "Amna Yousaf", age: 21, dept: "Physics", gpa: 2.9 },
  { name: "Adnan Khalid", age: 23, dept: "CS", gpa: 3.2 },
  { name: "Rabia Zubair", age: 26, dept: "Chemical", gpa: 3.8 },
  { name: "Kamran Akmal", age: 20, dept: "Math", gpa: 2.7 },
  { name: "Nadia Sheikh", age: 25, dept: "CS", gpa: 3.6 }
];

async function run() {
    try {
      const client = await clientPromise;
      const db = client.db('university');
      const collection = db.collection('students');
      const result = await collection.insertMany(students);
      console.log(`${result.insertedCount} students inserted`);
    } catch (err) {
      console.error('Error inserting students:', err);
    }
  }
  
  run();