import React from 'react';
import InspectorCertifications from '../components/InspectorCertifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faShieldHalved, faCar, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const OurInspectorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Meet Our Expert Inspectors
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Our team of certified professionals brings years of experience and expertise to every inspection.
          </p>
        </div>
      </div>

      {/* Why Choose Our Inspectors */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Inspectors?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We pride ourselves on having the most qualified and experienced inspectors in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FontAwesomeIcon icon={faUserTie} className="h-10 w-10 text-blue-600" />,
                title: 'Professional',
                description: 'Our inspectors are trained professionals with years of experience in the automotive industry.'
              },
              {
                icon: <FontAwesomeIcon icon={faShieldHalved} className="h-10 w-10 text-blue-600" />,
                title: 'Certified',
                description: 'All our inspectors hold multiple industry certifications and undergo regular training.'
              },
              {
                icon: <FontAwesomeIcon icon={faCar} className="h-10 w-10 text-blue-600" />,
                title: 'Thorough',
                description: 'We perform a comprehensive 150+ point inspection on every vehicle we examine.'
              },
              {
                icon: <FontAwesomeIcon icon={faClipboardCheck} className="h-10 w-10 text-blue-600" />,
                title: 'Detailed Reports',
                description: 'Receive a complete report with photos and detailed explanations of our findings.'
              }
            ].map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <InspectorCertifications />

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to schedule an inspection?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Our certified inspectors are ready to provide you with a thorough vehicle inspection.
          </p>
          <a
            href="/schedule"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Schedule Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurInspectorsPage;
