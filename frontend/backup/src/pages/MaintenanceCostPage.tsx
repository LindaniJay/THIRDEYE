import React from 'react';
import MaintenanceCostCalculator from '../components/MaintenanceCostCalculator';
import { FaCalculator, FaCar, FaTools, FaInfoCircle } from 'react-icons/fa';

const MaintenanceCostPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <FaCalculator className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Vehicle Maintenance Cost Calculator
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Estimate the true cost of owning a vehicle over time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Calculator Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-12">
            <div className="p-6">
              <MaintenanceCostCalculator />
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-md">
                    <FaCar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Understanding Ownership Costs</h3>
                </div>
                <div className="prose prose-blue text-gray-600">
                  <p>
                    The total cost of owning a vehicle goes far beyond the purchase price. Our calculator helps you understand the full financial picture by considering:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Routine maintenance and unexpected repairs</li>
                    <li>Fuel expenses based on your annual mileage</li>
                    <li>Insurance premiums</li>
                    <li>Depreciation (the loss of value over time)</li>
                    <li>Registration and taxes</li>
                  </ul>
                  <p className="mt-4">
                    By understanding these costs upfront, you can make a more informed decision about which vehicle fits your budget in the long run.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-md">
                    <FaTools className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Maintenance Tips</h3>
                </div>
                <div className="prose prose-blue text-gray-600">
                  <p>
                    Regular maintenance is key to reducing long-term ownership costs. Here are some tips to keep your vehicle running smoothly:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Follow the manufacturer's recommended maintenance schedule</li>
                    <li>Change oil and filters regularly</li>
                    <li>Check and maintain proper tire pressure</li>
                    <li>Address small issues before they become major repairs</li>
                    <li>Keep detailed service records</li>
                  </ul>
                  <p className="mt-4">
                    A well-maintained vehicle not only costs less to operate but also retains more of its value over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex">
              <FaInfoCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    The results provided by this calculator are estimates based on average costs and should be used for informational purposes only. Actual costs may vary based on your specific vehicle, location, driving habits, and other factors. For a more accurate assessment, please consult with a qualified automotive professional.
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

export default MaintenanceCostPage;
