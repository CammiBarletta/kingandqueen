import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
 
const productos = [
  {nombre:"Royal Canin Medium Adult 15kg",descripcion:"Alimento premium para perros adultos de raza mediana.",avatar:"https://i.imgur.com/8Km9tLL.png",precio:"85000",categoria:"alimentacion",destacado:true,activo:true,stock:8,precioAnterior:"92000",orden:1},
  {nombre:"Old Prince Adulto Cordero y Arroz 15kg",descripcion:"Proteínas noveles para digestión sensible.",avatar:"https://i.imgur.com/2nCt3Sbl.jpg",precio:"72000",categoria:"alimentacion",destacado:true,activo:true,stock:12,precioAnterior:"78000",orden:2},
  {nombre:"Pipeta Antipulgas Perros Grandes",descripcion:"Protección contra pulgas y garrapatas por 30 días.",avatar:"https://i.imgur.com/7yUvePI.png",precio:"12500",categoria:"salud",destacado:true,activo:true,stock:25,precioAnterior:"15000",orden:3},
  {nombre:"Arena Sanitaria Premium Gatos 10kg",descripcion:"Control total de olores y máxima absorción.",avatar:"https://i.imgur.com/Qs9XQ8b.png",precio:"13500",categoria:"higiene",destacado:true,activo:true,stock:30,precioAnterior:"15000",orden:4},
  {nombre:"Cama Soft Plush Mediana",descripcion:"Cama súper cómoda y lavable.",avatar:"https://i.imgur.com/yd9G9bY.png",precio:"28000",categoria:"accesorios",destacado:true,activo:true,stock:6,precioAnterior:"32000",orden:5},
  {nombre:"Pelota Mordillo Resistente",descripcion:"Juguete ideal para morder y liberar estrés.",avatar:"https://i.imgur.com/Mx7dF6p.png",precio:"6500",categoria:"juguetes",destacado:false,activo:true,stock:40,precioAnterior:"7500",orden:10},
  {nombre:"Rascador para Gatos Torre",descripcion:"Rascador con plataformas y cuerda sisal.",avatar:"https://i.imgur.com/2DhmtJ4.png",precio:"39000",categoria:"juguetes",destacado:false,activo:true,stock:7,precioAnterior:"45000",orden:11},
  {nombre:"Shampoo Hipoalergénico Perros",descripcion:"Ideal para piel sensible.",avatar:"https://i.imgur.com/XbK7XK7.png",precio:"8900",categoria:"higiene",destacado:false,activo:true,stock:20,precioAnterior:"9900",orden:12},
];
 
export async function cargarProductosIniciales() {
  for (const producto of productos) {
    const docRef = await addDoc(collection(db, "productos"), producto);
    console.log("✅", producto.nombre, "→ id:", docRef.id);
  }
  console.log("🎉 Todos los productos cargados");
}
 