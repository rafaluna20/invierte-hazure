import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const signInUser = async (email, password) => {
  const auth = getAuth();
  console.log(email, password);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Usuario autenticado exitoso:", userCredential.user);
    return true;
  } catch (error) {
    console.error("Error al autenticarse:", error.code, error.message);
    return false;
  }
};
