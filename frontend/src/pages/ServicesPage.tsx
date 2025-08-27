import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Vehicle Inspections',
    description: 'Comprehensive vehicle inspections to ensure you make an informed purchase decision. Our detailed reports cover all critical aspects of the vehicle.',
    price: 'From R800',
    features: [
      '200+ point inspection',
      'Mechanical & electrical assessment',
      'Accident & flood damage check',
      'Service history verification',
      'Test drive evaluation',
      'Detailed digital report with photos',
      'Professional recommendations'
    ],
    duration: '1-2 hours',
    bestFor: 'Used car buyers and sellers',
    icon: 'car',
    color: 'blue'
  },
  {
    title: 'New Car Consultation',
    description: 'Expert guidance for your new vehicle purchase in KwaZulu-Natal. Make confident decisions with our professional advice and market insights.',
    price: 'R500',
    features: [
      'Market value assessment',
      'Model comparison',
      'Feature analysis',
      'Negotiation tips',
      'Dealership recommendations',
      'Financing advice',
      'Warranty & service plan guidance'
    ],
    duration: '1-2 hours',
    bestFor: 'First-time buyers or those seeking expert advice',
    icon: 'car',
    color: 'indigo'
  },
  {
    title: 'Rental Property Inspections',
    description: 'Professional property inspections to protect both tenants and landlords. Document the property condition before you move in or out.',
    price: 'From R600',
    features: [
      'Detailed condition report',
      'High-resolution photos',
      'Plumbing & electrical checks',
      'Appliance testing',
      'Safety compliance check',
      'Meter readings',
      'Keys and security verification'
    ],
    duration: '1-3 hours',
    bestFor: 'Tenants and landlords',
    icon: 'home',
    color: 'emerald'
  }
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
              <div className={`p-3 rounded-full bg-${service.color}-500/20`}>
                {service.icon === 'home' ? (
                  <svg className={`w-8 h-8 text-${service.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : service.icon === 'car' ? (
                  <svg className={`w-8 h-8 text-${service.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h3m0 0V4h3m-3 3a4 4 0 01-4 4H4v4h2a1 1 0 011 1v2m0 0h8v-2a1 1 0 00-1-1h-2m-4 0H5m0 0v-2a1 1 0 011-1h2m-3 0H4m0 0h2m0 0h2" />
                  </svg>
                ) : (
                  <svg className={`w-8 h-8 text-${service.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white ml-4">{service.title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">{service.description}</p>
            
            {service.features && (
              <ul className="mb-4 space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                {service.duration && (
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration}
                  </div>
                )}
                {service.bestFor && (
                  <div className="text-sm text-blue-400 font-medium">
                    {service.bestFor}
                  </div>
                )}
                {service.price && (
                  <div className="bg-blue-600/20 text-blue-300 text-sm font-bold px-4 py-2 rounded-full">
                    {service.price} <span className="text-xs font-normal opacity-80">incl. VAT</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
