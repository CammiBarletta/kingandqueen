import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const productos = [
  {
    nombre: "Royal Canin Medium Adult 15kg",
    descripcion: "Alimento premium para perros adultos de raza mediana.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782636/ROYA_3182550402217-7_iqbtf4.jpg",
    precio: 85000,
    precioAnterior: 92000,
    categoria: "alimentacion",
    mascota: "perro",
    destacado: true,
    activo: true,
    stock: 8,
    orden: 1,
  },
  {
    nombre: "Royal Canin Urinary Razas Pequeñas",
    descripcion: "Alimento balanceado para perros de razas pequeñas con salud urinaria.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778779586/productos/fucqcnpewz8dcwnhcm5t.png",
    precio: 78000,
    precioAnterior: 85000,
    categoria: "alimentacion",
    mascota: "perro",
    destacado: false,
    activo: true,
    stock: 10,
    orden: 2,
  },
  {
    nombre: "Old Prince Adulto Cordero y Arroz 15kg",
    descripcion: "Proteínas noveles para digestión sensible.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782652/cordero-1-33c8c2641c0a764a1d17103346497236-640-0_vm70pa.webp",
    precio: 72000,
    precioAnterior: 78000,
    categoria: "alimentacion",
    mascota: "perro",
    destacado: true,
    activo: true,
    stock: 12,
    orden: 3,
  },
  {
    nombre: "Pipeta Antipulgas Perros Grandes",
    descripcion: "Protección contra pulgas y garrapatas por 30 días.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782679/028230bb-211c-4742-b9ca-c3e33b3c7db6.eb5a45a332733b33a69187c3f0a751f3_feixup.jpg",
    precio: 12500,
    precioAnterior: 15000,
    categoria: "salud",
    mascota: "perro",
    destacado: true,
    activo: true,
    stock: 25,
    orden: 4,
  },
  {
    nombre: "Arena Sanitaria Premium Manzana 10kg",
    descripcion: "Control total de olores con fragancia a manzana y máxima absorción.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782695/Premium_Manzana_Front_4kg_cqe6wk.jpg",
    precio: 13500,
    precioAnterior: 15000,
    categoria: "higiene",
    mascota: "gato",
    destacado: true,
    activo: true,
    stock: 30,
    orden: 5,
  },
  {
    nombre: "Cama Soft Plush Mediana",
    descripcion: "Cama súper cómoda y lavable.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782720/Waterproof-Kennel-Soft-Oval-Snuggle-Corduroy-Polyester-PV-Plush-Cat-Dog-Pet-Bed-for-Small-Medium-Large-Dogs_p8ryuz.webp",
    precio: 28000,
    precioAnterior: 32000,
    categoria: "accesorios",
    mascota: "ambos",
    destacado: true,
    activo: true,
    stock: 6,
    orden: 6,
  },
  {
    nombre: "Pelota Mordillo Resistente",
    descripcion: "Juguete ideal para morder y liberar estrés.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782748/FOTOS-FEED-SIN-FONDO-min_bytg6p.png",
    precio: 6500,
    precioAnterior: 7500,
    categoria: "juguetes",
    mascota: "perro",
    destacado: false,
    activo: true,
    stock: 40,
    orden: 7,
  },
  {
    nombre: "Rascador para Gatos Torre",
    descripcion: "Rascador con plataformas y cuerda sisal.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782766/torre-rascador-para-gatos-6-montajes-en-1-sweet-home-386146_srjvyh.jpg",
    precio: 39000,
    precioAnterior: 45000,
    categoria: "juguetes",
    mascota: "gato",
    destacado: false,
    activo: true,
    stock: 7,
    orden: 8,
  },
  {
    nombre: "Shampoo Hipoalergénico Perros",
    descripcion: "Ideal para piel sensible.",
    avatar: "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778782774/CANISH-HIPOALERGENICOP_nqvetsp.jpg",
    precio: 8900,
    precioAnterior: 9900,
    categoria: "higiene",
    mascota: "perro",
    destacado: false,
    activo: true,
    stock: 20,
    orden: 9,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// cargarProductosIniciales()
// Carga los productos en Firestore evitando duplicados.
// Antes de insertar cada producto, verifica que no exista uno con el mismo nombre.
// ─────────────────────────────────────────────────────────────────────────────
export async function cargarProductosIniciales() {
  const productosRef = collection(db, "productos");

  for (const producto of productos) {
    // Verificar si ya existe un producto con el mismo nombre
    const q = query(productosRef, where("nombre", "==", producto.nombre));
    const existing = await getDocs(q);

    if (!existing.empty) {
      console.warn("⚠️ Ya existe, se omite:", producto.nombre);
      continue;
    }

    const docRef = await addDoc(productosRef, {
      ...producto,
      createdAt: new Date(),
    });

    console.log("✅", producto.nombre, "→ id:", docRef.id);
  }

  console.log("🎉 Carga finalizada");
}