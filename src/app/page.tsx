"use client";
import {useState} from "react";
import sgMail from "@sendgrid/mail";

import {SENDGRID_API_KEY} from "./api";



type Coupon = {
  email: string;
  discount: string;
  code: string;
};

export default function HomePageClient() {

  sgMail.setApiKey(SENDGRID_API_KEY);

  const [email, setEmail] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>(
    JSON.parse(localStorage.getItem("cupons") || "[]"),
  );

  const CreateCupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !discount) return;

    const code = Math.random().toString(36).substring(7).toUpperCase();
    const newCoupon = {email, discount, code};

    const updatedCoupons = [...coupons, newCoupon];

    setCoupons(updatedCoupons);
    localStorage.setItem("cupons", JSON.stringify(updatedCoupons));

   const msg = {
      to: email,
      from: "fantasmano423@gmail.com",
      subject: "Cupon de descuento",
      text: `¡Felicidades! Ganaste un cupón de descuento. Tu cupón de descuento es: ${code}`,
    };

    await sgMail.send(msg);

    setEmail("");
    setDiscount("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-lg border-2 border-white bg-black p-6 text-white shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">Generador de Codigos</h1>

        <form onSubmit={CreateCupon}>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ejemplo@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="mb-2 mt-4 block text-sm font-medium" htmlFor="couponPercentage">
            Porcentaje de cupon
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="Discount"
            placeholder="5"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <button
            className="mt-4 w-full rounded-lg bg-white p-2 text-black shadow-md transition-all hover:bg-gray-300"
            type="submit"
          >
            Generar Cupon
          </button>
        </form>
      </div>

      <div className="rounded-lg border-2 border-white bg-black p-6 text-white shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Cupones Generados</h2>

        <div className="max-h-80 overflow-y-auto">
          {coupons.map((cupon) => (
            <div key={cupon.code} className="mb-4 rounded-lg bg-gray-800 p-4">
              <p className="mb-2 text-sm">
                <strong>Correo Electrónico:</strong> {cupon.email}
              </p>
              <p className="mb-2 text-sm">
                <strong>Descuento:</strong> {cupon.discount}%
              </p>
              <p className="mb-2 text-sm">
                <strong>Código:</strong> {cupon.code}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
