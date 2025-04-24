import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db();

  // Parse query params
  let query = {};
  let sort = {};
  let countByDept = false;
  if (request && request.nextUrl) {
    const url = new URL(request.nextUrl);
    const params = url.searchParams;
    if (params.get("dept")) query.dept = params.get("dept");
    if (params.get("ageGt")) query.age = { $gt: Number(params.get("ageGt")) };
    if (params.get("gpaGte")) query.gpa = { $gte: params.get("gpaGte") };
    if (params.get("depts")) query.dept = { $in: params.get("depts").split(",") };
    if (params.get("nameStartsWith")) query.name = { $regex: `^${params.get("nameStartsWith")}`, $options: "i" };
    if (params.get("sortByGpaDesc")) sort.gpa = -1;
    if (params.get("countByDept")) countByDept = true;
  }

  if (countByDept) {
    const counts = await db.collection("students").aggregate([
      { $group: { _id: "$dept", count: { $sum: 1 } } }
    ]).toArray();
    return Response.json({ counts });
  }

  const students = await db.collection("students").find(query).sort(sort).toArray();
  return Response.json({ students });
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
