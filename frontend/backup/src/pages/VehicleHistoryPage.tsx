import React from 'react';
import VehicleHistoryLookup from '../components/VehicleHistoryLookup';
import { FaCar, FaShieldAlt, FaFileAlt } from 'react-icons/fa';

const VehicleHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Vehicle History Reports
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Get a comprehensive history report for any vehicle by entering its VIN
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Check a Vehicle's History?
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <FaCar className="h-10 w-10 text-blue-600" />,
                  title: 'Accident History',
                  description: 'Discover if the vehicle has been in any reported accidents and the extent of the damage.'
                },
                {
                  icon: <FaShieldAlt className="h-10 w-10 text-blue-600" />,
                  title: 'Title Status',
                  description: 'Verify if the title is clean, salvaged, rebuilt, or has any other brand that could affect value.'
                },
                {
                  icon: <FaFileAlt className="h-10 w-10 text-blue-600" />,
                  title: 'Service Records',
                  description: 'View reported service history to understand how well the vehicle has been maintained.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lookup Form */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <VehicleHistoryLookup />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">How to Find Your VIN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Common VIN Locations</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>On the driver's side dashboard (visible through the windshield)</li>
                    <li>Driver's side door jamb (sticker or metal plate)</li>
                    <li>Vehicle registration documents</li>
                    <li>Insurance card or policy</li>
                    <li>Vehicle title</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What is a VIN?</h4>
                  <p className="text-gray-600 mb-4">
                    A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every motor vehicle when it's manufactured. 
                    It serves as the vehicle's fingerprint, as no two vehicles in operation have the same VIN.
                  </p>
                  <h4 className="font-medium text-gray-900 mb-2">Why is it important?</h4>
                  <p className="text-gray-600">
                    Checking a vehicle's history by its VIN helps you make an informed decision before purchasing a used car. 
                    It can reveal important information about the vehicle's past that might not be disclosed by the seller.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryPage;
