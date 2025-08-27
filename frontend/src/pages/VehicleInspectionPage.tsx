import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCar, 
  faCarCrash, 
  faScrewdriverWrench, 
  faClipboardCheck, 
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import InspectorCertifications from '../components/InspectorCertifications';
import MaintenanceCostCalculator from '../components/MaintenanceCostCalculator';
import VehicleHistoryLookup from '../components/VehicleHistoryLookup';
import Testimonials from '../components/Testimonials';

const VehicleInspectionPage: React.FC = () => {
  const inspectionPoints = [
    {
      title: 'Exterior Inspection',
      icon: <FontAwesomeIcon icon={faCar} className="w-6 h-6" />,
      items: [
        'Body condition and paintwork (checking for accident damage common on SA roads)',
        'Tire condition and tread depth (including spare wheel and jack)',
        'Lights and indicators (essential for KZN misty conditions)',
        'Windshield and windows (checking for chips from gravel roads)',
        'Suspension and undercarriage (inspecting for pothole damage)'
      ]
    },
    {
      title: 'Interior Inspection',
      icon: <FontAwesomeIcon icon={faClipboardCheck} className="w-6 h-6" />,
      items: [
        'Upholstery and trim condition (checking for flood damage)',
        'Dashboard and controls (including air conditioning for SA heat)',
        'Electronics and infotainment (radio, USB ports, Bluetooth)', 
        'Climate control system (essential for SA weather conditions)',
        'Safety features (airbags, seatbelts, child locks)'
      ]
    },
    {
      title: 'Mechanical Inspection',
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} className="w-6 h-6" />,
      items: [
        'Engine performance',
        'Transmission operation',
        'Brake system',
        'Exhaust system',
        'Fluid levels and conditions'
      ]
    },
    {
      title: 'Test Drive',
      icon: <FontAwesomeIcon icon={faCarCrash} className="w-6 h-6" />,
      items: [
        'Engine start and idle (checking for cold start issues)',
        'Acceleration and power delivery (testing on hills common in KZN)',
        'Braking performance (including emergency stops)',
        'Steering response (checking for alignment issues from potholes)',
        'Suspension and handling (testing on various road conditions)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            RMI-Approved Vehicle Inspections in South Africa
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get peace of mind with our thorough 150+ point inspection service, conducted by RMI-certified inspectors. Our reports are accepted by all major South African banks and insurance companies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Book Inspection from R1,499
            </Link>
            <Link 
              to="/pricing" 
              className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 border border-white rounded-lg transition-colors duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Inspection Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included in Our Inspection</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {inspectionPoints.map((section, index) => (
              <div key={index} className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
                <div className="text-blue-400 mb-4">{section.icon}</div>
                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle History Lookup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-blue-400 text-2xl mr-3" />
            <h2 className="text-2xl font-bold">Check Vehicle History</h2>
          </div>
          <VehicleHistoryLookup />
        </div>
      </section>

      {/* Maintenance Cost Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Estimate Maintenance Costs (ZAR)</h2>
          <MaintenanceCostCalculator />
        </div>
      </section>

      {/* Inspector Certifications */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Certified Inspectors</h2>
          <InspectorCertifications />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by South African Motorists</h2>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready for a Professional RMI Inspection?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule your vehicle inspection today and drive with confidence knowing your vehicle meets South African roadworthy standards. Our reports include a 30-day guarantee.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VehicleInspectionPage;
