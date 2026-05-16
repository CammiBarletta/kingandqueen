// src/services/ProductService.js
// Capa de acceso a datos para productos — Firebase v9 Modular SDK
// Colección Firestore: "productos"

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase"; // src/firebase.js

// Referencia a la colección "productos"
const productosRef = collection(db, "productos");

// ─────────────────────────────────────────────────────────────────────────────
// getProducts()
// Devuelve todos los productos activos, ordenados por el campo "orden".
// ─────────────────────────────────────────────────────────────────────────────
export const getProducts = async () => {
  try {
    const q = query(
      productosRef,
      where("activo", "==", true),
      orderBy("orden", "asc")
    );

    const snapshot = await getDocs(q);

    // Convertimos cada documento en un objeto plano con su id incluido
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("[ProductService] Error en getProducts:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getFeaturedProducts()
// Devuelve solo los productos activos Y destacados, ordenados por "orden".
// ─────────────────────────────────────────────────────────────────────────────
export const getFeaturedProducts = async () => {
  try {
    const q = query(
      productosRef,
      where("activo", "==", true),
      where("destacado", "==", true),
      orderBy("orden", "asc")
    );

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("[ProductService] Error en getFeaturedProducts:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// createProduct(product)
// Agrega un nuevo producto a Firestore.
// El campo "createdAt" se inyecta automáticamente con serverTimestamp().
//
// @param {Object} product — Todos los campos del producto SIN createdAt
// @returns {string} — El id del documento recién creado
// ─────────────────────────────────────────────────────────────────────────────
export const createProduct = async (product) => {
  try {
    const newProduct = {
      ...product,
      createdAt: serverTimestamp(), // timestamp generado en el servidor de Firebase
    };

    const docRef = await addDoc(productosRef, newProduct);
    return docRef.id;
  } catch (error) {
    console.error("[ProductService] Error en createProduct:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// updateProduct(id, data)
// Actualiza campos específicos de un producto existente (merge parcial).
//
// @param {string} id   — ID del documento en Firestore
// @param {Object} data — Campos a actualizar (solo los que cambian)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProduct = async (id, data) => {
  try {
    const productDoc = doc(db, "productos", id);
    await updateDoc(productDoc, data);
  } catch (error) {
    console.error("[ProductService] Error en updateProduct:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteProduct(id)
// Elimina un producto por su ID.
// Para un ecommerce real, considera usar deleteProduct solo en admin,
// y preferir updateProduct({ activo: false }) para "borrado lógico".
//
// @param {string} id — ID del documento en Firestore
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProduct = async (id) => {
  try {
    const productDoc = doc(db, "productos", id);
    await deleteDoc(productDoc);
  } catch (error) {
    console.error("[ProductService] Error en deleteProduct:", error);
    throw error;
  }
};