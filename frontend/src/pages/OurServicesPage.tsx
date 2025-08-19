import React from 'react';
import { FaCar, FaHome } from 'react-icons/fa';

const OurServicesPage: React.FC = () => {
  const services = [
    {
      icon: <FaCar className="h-16 w-16 text-blue-600" />,
      title: 'Vehicle Inspections',
      description: 'Comprehensive 200+ point inspection covering all major vehicle systems. Our certified inspectors provide detailed reports with photos and recommendations to ensure you make an informed decision.',
      features: [
        'Pre-purchase inspections',
        'Maintenance check-ups',
        'Warranty verification',
        'Service cost estimates',
        'Vehicle history reports'
      ]
    },
    {
      icon: <FaHome className="h-16 w-16 text-blue-600" />,
      title: 'Property Inspections',
      description: 'Thorough property assessments for buyers, sellers, and renters. Our detailed reports cover all major systems and potential issues.',
      features: [
        'Pre-purchase inspections',
        'Rental property assessments',
        'Structural evaluations',
        'Plumbing & electrical checks',
        'Comprehensive reporting'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background overlay */}
      <div className="fixed inset-0 -z-10 bg-gray-900/80 backdrop-blur-sm"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Services
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Professional inspection services for your most important assets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="backdrop-blur-lg bg-white/10 backdrop-filter rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] border border-white/20 hover:border-white/30"
            >
              <div className="p-8">
                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md mx-auto mb-6 shadow-lg">
                  {React.cloneElement(service.icon, { className: 'h-10 w-10 text-blue-700' })}
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-200 text-center mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center backdrop-blur-sm bg-white/10 rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help Choosing the Right Inspection?
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Our team is here to help you select the perfect inspection service for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
      {/* End of main content */}
    </div>
  );
};

export default OurServicesPage;
