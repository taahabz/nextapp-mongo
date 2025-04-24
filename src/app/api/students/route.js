import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const client = await clientPromise;
  const db = client.db();
  
  let query = {};
  let pipeline = [];
  let options = {};

  // Handle different query parameters
  if (searchParams.has("dept")) {
    query.dept = searchParams.get("dept");
  }
  
  if (searchParams.has("ageGt")) {
    query.age = { $gt: parseInt(searchParams.get("ageGt")) };
  }
  
  if (searchParams.has("gpaGte")) {
    query.gpa = { $gte: parseFloat(searchParams.get("gpaGte")) };
  }
  
  if (searchParams.has("depts")) {
    const depts = searchParams.get("depts").split(",");
    query.dept = { $in: depts };
  }
  
  if (searchParams.has("nameStartsWith")) {
    query.name = { $regex: `^${searchParams.get("nameStartsWith")}`, $options: 'i' };
  }

  if (searchParams.has("sortByGpaDesc")) {
    options.sort = { gpa: -1 };
  }

  // Get students based on query
  const students = await db.collection("students").find(query, options).toArray();
  
  // If counting by department is requested
  let counts = [];
  if (searchParams.has("countByDept")) {
    counts = await db.collection("students").aggregate([
      { $group: { _id: "$dept", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
  }

  return Response.json({ students, counts });
}

export async function POST(request) {
  const { name, age, dept, gpa } = await request.json();
  if (!name || !age || !dept || !gpa) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  await db.collection("students").insertOne({ name, age, dept, gpa });
  return Response.json({ success: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  await db.collection("students").deleteOne({ _id: new ObjectId(id) });
  return Response.json({ success: true });
}

