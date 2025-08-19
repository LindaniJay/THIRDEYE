import React from 'react';
import { NavLink } from 'react-router-dom';
import Testimonials from '../components/Testimonials';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
     {/* Hero Section */}
<section
  className="relative text-center py-20 bg-cover bg-center rounded-lg shadow-xl overflow-hidden"
  style={{ backgroundImage: "url('/your-bg.jpg')" }}
>
  {/* Glassmorphism container */}
  <div className="relative w-full h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-10 shadow-2xl flex flex-col items-center justify-center">
    
    {/* Dark overlay only inside glass */}
    <div className="absolute inset-0 bg-black/40 rounded-lg"></div>

    {/* Content */}
    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
        Your Trusted Inspection Partner in KwaZulu-Natal
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
        Expert vehicle inspections and rental property evaluations to ensure your peace of mind in KZN.
      </p>
      <NavLink
        to="/contact"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
      >
        Book an Inspection Today
      </NavLink>
    </div>
  </div>
</section>



      {/* Services Overview */}
      <section className="glass">
        <h2 className="text-3xl font-bold text-center mb-8">Our Core Services</h2>
        <div className="grid md:grid-cols-2 gap-8 text-center">
          <div className="glass p-6 hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Vehicle Inspections</h3>
            <p>Comprehensive pre-purchase checks to ensure your next car is a great investment.</p>
          </div>
          <div className="glass p-6 hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-xl font-bold mb-2">Rental Property Inspections</h3>
            <p>Arrive in KZN with confidence. We inspect your new rental apartment or house before you move in.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="glass p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Trust THIRDEYE?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold">Professionalism</h3>
            <p className="text-gray-400 mt-2">Our certified inspectors deliver meticulous, industry-standard reports.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">KwaZulu-Natal Focus</h3>
            <p className="text-gray-400 mt-2">We are specialists in the KZN market, providing localized expertise for your vehicle and rental needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Client Satisfaction</h3>
            <p className="text-gray-400 mt-2">Your confidence is our priority. We're dedicated to exceptional service.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Total Trustworthiness</h3>
            <p className="text-gray-400 mt-2">As an independent third party, our evaluations are always unbiased.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

    </div>
  );
};

export default HomePage;
