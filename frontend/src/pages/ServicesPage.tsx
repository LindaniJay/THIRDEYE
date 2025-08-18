import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Vehicle Inspections',
    description: 'Our comprehensive vehicle inspections in KwaZulu-Natal cover over 200 checkpoints, including engine, transmission, diagnostics, and bodywork. Whether you are buying a used car or want to assess your current vehicle, our detailed reports give you the clarity you need to make an informed decision.',
  },
  {
    title: 'Rental Property Inspections',
    description: 'Relocating to KZN? Arrive with confidence. We inspect rental apartments and houses on your behalf before you sign the lease. Our reports cover the condition of the property, plumbing, electrical systems, and any potential issues, ensuring your new home is safe and ready for your arrival.',
  },
];

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
        <p className="text-xl text-gray-300">Clarity and confidence for your most important decisions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass p-8 rounded-2xl transform transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full ${index % 2 === 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                {index % 2 === 0 ? (
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white ml-4">{service.title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
