import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const pricingOptions = [
  {
    title: 'Vehicle Inspections',
    price: '800',
    features: [
      '200+ point inspection',
      'Mechanical & electrical assessment',
      'Accident & flood damage check',
      'Service history verification',
      'Test drive evaluation',
      'Detailed digital report with photos'
    ],
    cta: 'Book Inspection',
  },
  {
    title: 'New Car Consultation',
    price: '500',
    features: [
      'Market value assessment',
      'Model comparison',
      'Feature analysis',
      'Negotiation tips',
      'Dealership recommendations',
      'Financing & warranty advice'
    ],
    cta: 'Get Consultation',
  },
  {
    title: 'Rental Property Inspections',
    price: '600',
    features: [
      'Detailed condition report',
      'High-resolution photos',
      'Plumbing & electrical checks',
      'Appliance testing',
      'Safety compliance check',
      'Meter readings verification'
    ],
    cta: 'Book Inspection',
  },
  {
    title: 'Holiday Accommodation',
    price: '700',
    features: [
      'Pre-arrival verification',
      'Facilities and amenities check',
      'Cleanliness and safety inspection',
      'Photo documentation',
      'Listing comparison',
      'Detailed inspection report'
    ],
    cta: 'Book Inspection',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">Our Pricing</h1>
        <p className="text-gray-100 dark:text-gray-300 text-xl font-medium bg-black/20 dark:bg-white/10 px-6 py-3 rounded-lg inline-block">No hidden fees. Just clear, upfront costs for our expert services.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {pricingOptions.map((option, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-8 rounded-2xl flex flex-col transform transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-2xl font-bold text-bright-yellow mb-4">{option.title}</h2>
            <span className="text-4xl font-extrabold text-bright-yellow mb-6">R{option.price}<span className="text-lg font-medium text-white"> /from</span></span>
            <ul className="space-y-3 text-white mb-8 flex-grow">
              {option.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-5 h-5 text-bright-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <NavLink to="/contact" className="btn-primary mt-auto w-full text-center block">
              {option.cta}
            </NavLink>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="glass text-center mt-16 p-8 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Multiple Inspections?</h2>
        <p className="text-gray-200 mb-6">Need us to check out a few vehicles or properties? Contact us for a custom package deal.</p>
        <NavLink 
          to="/contact" 
          className="inline-block mt-4 px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Contact Us
        </NavLink>
      </motion.div>
    </div>
  );
};

export default PricingPage;
