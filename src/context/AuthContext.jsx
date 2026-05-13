import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Firebase avisa automáticamente cuando cambia el estado de sesión
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUsuario({
          nombre: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setUsuario(null);
      }
      setCargando(false);
    });

    return () => unsubscribe(); // limpieza al desmontar
  }, []);

  // Iniciar sesión con email + password
  const iniciarSesion = async (email, password) => {
    const resultado = await signInWithEmailAndPassword(auth, email, password);
    return resultado.user;
  };

  // Registrar nuevo usuario
  const registrar = async (nombre, email, password) => {
    const resultado = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(resultado.user, { displayName: nombre });
    return resultado.user;
  };

  // Cerrar sesión
  const cerrarSesion = () => signOut(auth);

  const value = {
    usuario,
    iniciarSesion,
    registrar,
    cerrarSesion,
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