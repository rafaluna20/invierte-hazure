import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

async function actualizarPhone(uid, phone) {
  try {
    const db = getFirestore();
    const usuarioDocRef = doc(db, "usuarios", uid);

    // Obtener el saldo actual del usuario
    const usuarioSnapshot = await getDoc(usuarioDocRef);

    if (usuarioSnapshot.exists()) {
      await updateDoc(usuarioDocRef, {
        phone: phone,
      });
    } else {
      console.error(
        'El usuario no tiene un documento en la colección "usuarios".'
      );
    }
  } catch (error) {
    console.error("Error al sumar al saldo:", error);
  }
}

export default actualizarPhone;
