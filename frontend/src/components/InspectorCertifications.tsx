import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCertificate, 
  faCarCrash, 
  faScrewdriverWrench, 
  faUserTie, 
  faShieldHalved 
} from '@fortawesome/free-solid-svg-icons';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  description: string;
  icon: React.ReactNode;
}

const InspectorCertifications: React.FC = () => {
  const certifications: Certification[] = [
    {
      id: '1',
      title: 'ASE Certified Master Technician',
      issuer: 'National Institute for Automotive Service Excellence',
      year: 2022,
      description: 'Demonstrates expertise in all areas of automotive repair and service.',
      icon: <FontAwesomeIcon icon={faCertificate} className="w-5 h-5 text-blue-500" />
    },
    {
      id: '2',
      title: 'Collision Repair Certification',
      issuer: 'I-CAR',
      year: 2023,
      description: 'Specialized training in vehicle collision damage assessment and repair.',
      icon: <FontAwesomeIcon icon={faCarCrash} className="w-8 h-8 text-blue-600" />
    },
    {
      id: '3',
      title: 'Advanced Diagnostic Specialist',
      issuer: 'Automotive Training Center',
      year: 2021,
      description: 'Expertise in modern vehicle computer systems and diagnostics.',
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} className="w-8 h-8 text-blue-600" />
    },
    {
      id: '4',
      title: 'Professional Inspector Certification',
      issuer: 'National Association of Certified Vehicle Inspectors',
      year: 2023,
      description: 'Certified to perform comprehensive vehicle inspections to industry standards.',
      icon: <FontAwesomeIcon icon={faUserTie} className="w-8 h-8 text-blue-600" />
    },
    {
      id: '5',
      title: 'Safety Inspection Certified',
      issuer: 'State Vehicle Inspection Board',
      year: 2023,
      description: 'Certified to perform state-required safety inspections.',
      icon: <FontAwesomeIcon icon={faShieldHalved} className="w-8 h-8 text-blue-600" />
    }
  ];

  const stats = [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Vehicles Inspected', value: '5,000+' },
    { label: 'Certifications', value: certifications.length },
    { label: 'Customer Satisfaction', value: '99%' },
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Certifications & Qualifications</h2>
        </div>
        
        {/* Stats */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-blue-600 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Certifications */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Certifications & Qualifications</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col rounded-2xl bg-gray-50 p-6 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                    {cert.icon}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{cert.title}</h4>
                    <p className="text-sm text-gray-500">{cert.issuer}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{cert.description}</p>
                <div className="mt-4 text-sm text-gray-500">Issued: {cert.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspection Process */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Our Inspection Process</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Initial Assessment',
                description: 'We start with a thorough visual inspection of the vehicle\'s exterior and interior.'
              },
              {
                step: '2',
                title: 'Mechanical Inspection',
                description: 'Detailed check of the engine, transmission, suspension, and other mechanical components.'
              },
              {
                step: '3',
                title: 'Test Drive',
                description: 'Road test to evaluate the vehicle\'s performance, handling, and identify any unusual noises.'
              },
              {
                step: '4',
                title: 'Diagnostic Scan',
                description: 'Computer diagnostics to check for any stored or pending trouble codes in the vehicle\'s systems.'
              },
              {
                step: '5',
                title: 'Undercarriage Inspection',
                description: 'Examination of the vehicle\'s undercarriage for signs of damage, rust, or leaks.'
              },
              {
                step: '6',
                title: 'Detailed Report',
                description: 'Comprehensive report with photos and recommendations for any issues found.'
              },
              {
                step: '7',
                title: 'Review & Consultation',
                description: 'Detailed walkthrough of our findings and recommendations with the customer.'
              },
              {
                step: '8',
                title: 'Post-Inspection Support',
                description: 'Available to answer any questions and provide guidance after the inspection.'
              }
            ].map((step) => (
              <div key={step.step} className="relative flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorCertifications;
