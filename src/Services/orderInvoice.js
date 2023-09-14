import { nanoid } from "nanoid";
import createInvoice from "./pdf.js";
import { sendEmail } from "./sendEmail.js";
let i = nanoid();
export const createInvoiceFromOrder = async (order, user) => {
  const invoice = {
    shipping: {
      name: user.userName,
      address: "My Home",
      city: "Nablus",
      state: "Westbank",
      country: "Palestine",
      postal_code: "3172",
    },
    items: order.products.map((product)=>{
        return {
            item: product.name,
            description: product.description,
            quantity: product.qty,
            amount: product.finalPrice,
          }
    }),
    subtotal: Number(order.subTotal),
    paid: 0,
    invoice_nr: order._id,
  };
  const name = `invoice${i}.pdf`
  createInvoice(invoice, name);
  sendEmail(user.email,'Invice', 'Welcome to E-commerce',{
    path: `./${name}`,
    contentType: 'application/pdf'
})
};
