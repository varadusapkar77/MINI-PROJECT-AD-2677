import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { CartItem } from "../context/AppContext";

export const saveOrder = async (
  items: CartItem[],
  total: number,
  address: string,
  phone: string,
  method: string
) => {
  const user = auth.currentUser;
  const ref = await addDoc(collection(db, "orders"), {
    userId: user?.uid,
    userEmail: user?.email,
    items: items.map((i) => ({
      id: i.product.id,
      title: i.product.title,
      price: i.product.price,
      qty: i.qty,
    })),
    total,
    address,
    phone,
    paymentMethod: method,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};