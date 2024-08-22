import { getFirestore, doc, getDoc } from "firebase/firestore";
async function obtenerPhone(uid) {
  const db = getFirestore();
  const usuarioDocRef = doc(db, "usuarios", uid);
  try {
    const snapshot = await getDoc(usuarioDocRef);

    if (snapshot.exists()) {
      const phone = snapshot.data().phone;
      return phone;
    } else {
      console.error(
        'El usuario no tiene un documento en la colección "usuarios"'
      );
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el numero:", error);
    return null;
  }
}

export default obtenerPhone;
