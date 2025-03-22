// BillingSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BillingSummary({ amount }) {
  return (
    <Link to="/billing"  className="p-4 bg-white  hover:bg-gray-100  rounded-lg shadow-lg">
      <h2 className="text-black text-xl font-bold">Billing</h2>
      <p className="text-black text-3xl font-bold">{amount}</p>
      <p className="text-black mt-2">  View Billing Details </p>
     </Link>
    
  );
}