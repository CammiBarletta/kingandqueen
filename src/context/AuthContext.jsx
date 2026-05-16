import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
          let isAdmin = false;
try {
  const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
  isAdmin = adminDoc.exists();
} catch {
  isAdmin = false;
}

setUsuario({
  nombre: firebaseUser.displayName || firebaseUser.email,
  email: firebaseUser.email,
  uid: firebaseUser.uid,
  isAdmin,
});
      } else {
        setUsuario(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const iniciarSesion = async (email, password) => {
    const resultado = await signInWithEmailAndPassword(auth, email, password);
    return resultado.user;
  };

  const registrar = async (nombre, email, password) => {
    const resultado = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(resultado.user, { displayName: nombre });
    return resultado.user;
  };

  const cerrarSesion = () => signOut(auth);

  const loginConGoogle = async () => {
    const resultado = await signInWithPopup(auth, googleProvider);
    return resultado.user;
  };

  const value = {
    usuario,
    iniciarSesion,
    registrar,
    cerrarSesion,
    loginConGoogle,
    isAuthenticated: !!usuario,
    cargando,
  };

  return (
    <AuthContext.Provider value={value}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
}