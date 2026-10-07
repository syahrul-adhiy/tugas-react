import { useParams } from "react-router-dom";

export default function Checkout() {
   const { id } = useParams();

   return (
      <div>
         <h1 className="text-2xl font-bold">Checkout</h1>
         <p className="mt-4 text-gray-700">Ini adalah halaman checkout AlungStore.</p>
      </div>
   );
}