import { db } from "../../../lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, username, email, photoURL } = body;

    if (!uid || !email || !username) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(usersRef, {
        uid,
        username,
        email,
        photoURL,
        created_at: new Date(),
      });

      return new Response(JSON.stringify({ created: true }), { status: 201 });
    }

    return new Response(JSON.stringify({ exists: true }), { status: 200 });
  } catch (err) {
    console.error("API /api/users POST error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
