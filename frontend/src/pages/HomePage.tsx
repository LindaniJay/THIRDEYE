import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <section className="glass p-8 overflow-hidden">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Core Services
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: 'car',
              title: 'Vehicle Inspections',
              price: 'From R800',
              description: '200+ point inspection covering all major vehicle systems with detailed digital report.'
            },
            {
              icon: 'user-tie',
              title: 'New Car Consultation',
              price: 'R500',
              description: 'Expert guidance for your new vehicle purchase with market insights and negotiation tips.'
            },
            {
              icon: 'house',
              title: 'Rental Inspections',
              price: 'From R600',
              description: 'Professional property condition reports to protect both tenants and landlords.'
            },
            {
              icon: 'umbrella-beach',
              title: 'Holiday Accommodation',
              price: 'From R700',
              description: 'Pre-arrival verification of holiday rentals to ensure they meet expectations.'
            }
          ].map((service, index) => (
            <motion.div 
              key={service.title}
              className="glass p-6 text-white border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                x: 0,
                transition: { 
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <i className={`fas fa-${service.icon} text-blue-400 text-xl`}></i>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{service.price}</p>
              <p className="text-gray-200 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="glass p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Why Trust THIRDEYE?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          <div>
            <h3 className="text-xl font-bold">Professionalism</h3>
            <p className="text-gray-200 mt-2">Our certified inspectors deliver meticulous, industry-standard reports.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">KwaZulu-Natal Focus</h3>
            <p className="text-gray-200 mt-2">We are specialists in the KZN market, providing localized expertise for your vehicle and rental needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Client Satisfaction</h3>
            <p className="text-gray-200 mt-2">Your confidence is our priority. We're dedicated to exceptional service.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">Total Trustworthiness</h3>
            <p className="text-gray-200 mt-2">As an independent third party, our evaluations are always unbiased.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

    </div>
  );
};

export default HomePage;
