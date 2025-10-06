import React from "react";

const Services = () => (
  <div className="bg-gray-100 py-16 text-center">
    <h2 className="text-3xl font-semibold mb-6">Our Services</h2>
    <div className="grid md:grid-cols-3 gap-6 px-8">
      {["Web Design", "Development", "SEO Optimization"].map((service, i) => (
        <div key={i} className="bg-white p-6 shadow rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">{service}</h3>
          <p className="text-gray-600">High-quality {service.toLowerCase()} tailored to your business needs.</p>
        </div>
      ))}
    </div>
  </div>
);

export default Services;
