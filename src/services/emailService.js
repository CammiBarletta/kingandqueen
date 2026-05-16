import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_45zr1kk";
const TEMPLATE_ID = "template_n9lc244";
const PUBLIC_KEY = "lUrvx0jjbj9Sbi2lp";

export const enviarMailPedido = (pedido) => {
  const productosTexto = pedido.productos
    .map(p => `${p.nombre} x${p.cantidad} - $${p.subtotal}`)
    .join("\n");

  const templateParams = {
    numero_pedido: pedido.numeroPedido,
    nombre: pedido.usuario.nombre,
    total: pedido.total,
    productos: productosTexto,
    email: pedido.usuario.email,
  };

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  );
};