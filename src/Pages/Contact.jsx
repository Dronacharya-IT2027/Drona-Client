import React from "react";

const Contact = () => (
  <div className="py-16 text-center bg-blue-50">
    <h2 className="text-3xl font-semibold mb-3">Contact Us</h2>
    <form className="max-w-md mx-auto mt-6 flex flex-col gap-4">
      <input type="text" placeholder="Your Name" className="border p-2 rounded" />
      <input type="email" placeholder="Your Email" className="border p-2 rounded" />
      <textarea placeholder="Your Message" className="border p-2 rounded"></textarea>
      <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send</button>
    </form>
  </div>
);

export default Contact;
