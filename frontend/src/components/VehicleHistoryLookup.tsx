import React, { useState } from 'react';
import { FaSearch, FaCar, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

interface HistoryReport {
  vin: string;
  make: string;
  model: string;
  year: number;
  titleStatus: string;
  accidentCount: number;
  lastOdometerReading: number;
  lastReportedDate: string;
  registrationNumber?: string;
  serviceHistory?: string;
  roadworthy?: boolean;
  financeCheck?: string;
  policeStolen?: string;
  previousOwners?: number;
  vehicleUsage?: string;
}

const VehicleHistoryLookup: React.FC = () => {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<HistoryReport | null>(null);
  const [showSample, setShowSample] = useState(false);

  const sampleReport: HistoryReport = {
    vin: 'AFAXX22W0C9123456', // Example South African VIN format
    make: 'Toyota',
    model: 'Hilux 2.8GD-6 Raider',
    year: 2022,
    titleStatus: 'No Title Issues',
    accidentCount: 1,
    lastOdometerReading: 45230, // in kilometers
    lastReportedDate: '2023-11-20',
    registrationNumber: 'CA 123-456',
    serviceHistory: 'Full service history',
    roadworthy: true,
    financeCheck: 'No outstanding finance',
    policeStolen: 'Not reported stolen',
    previousOwners: 1,
    vehicleUsage: 'Private'
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    // South African VIN validation (17 alphanumeric characters, case insensitive)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      setError('Please enter a valid 17-character VIN or registration number');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setReport(sampleReport);
      setShowSample(false);
    } catch (err) {
      setError('Failed to fetch vehicle history. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSample = () => {
    setReport(sampleReport);
    setShowSample(true);
    setError(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Vehicle History Report</h2>
      
      <div className="bg-blue-50/80 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <FaInfoCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="ml-3 text-sm font-medium text-blue-800">
            Enter your vehicle's 17-digit VIN to get a detailed history report.
          </p>
        </div>
      </div>

      <form onSubmit={handleLookup} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter VIN or registration number"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white/95 text-gray-900 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              maxLength={17}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all duration-200"
          >
            {isLoading ? 'Searching...' : <><FaSearch className="mr-2" /> Search</>}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {!report ? (
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <FaCar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">No vehicle history report</h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">Enter a VIN to get started or view a sample report.</p>
          <button
            onClick={handleViewSample}
            className="mt-6 inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            View Sample Report
          </button>
        </div>
      ) : (
        <div className="bg-white/95 rounded-xl shadow-sm p-6 text-gray-800 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
            <div className="bg-blue-100 p-4 rounded-xl shadow-inner mb-4 sm:mb-0 sm:mr-6">
              <FaCar className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{report.year} {report.make} {report.model}</h3>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
                  <p>Last reported: {new Date(report.lastReportedDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  {showSample && (
                    <div className="mt-2 sm:mt-0 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg inline-flex items-center">
                      <FaInfoCircle className="mr-2 flex-shrink-0" />
                      <span>This is a sample report for demonstration purposes.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1.5">Title Status</h4>
              <p className="text-lg font-semibold text-gray-900">{report.titleStatus}</p>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1.5">Odometer</h4>
              <p className="text-lg font-semibold text-gray-900">{report.lastOdometerReading.toLocaleString()} km</p>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1.5">Accident History</h4>
              <p className="text-lg font-semibold">
                {report.accidentCount === 0 ? 'No accidents reported' : `${report.accidentCount} accident${report.accidentCount > 1 ? 's' : ''} reported`}
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1.5">Roadworthy</h4>
              <p className="text-lg font-semibold text-gray-900">
                {report.roadworthy ? (
                  <span className="text-green-600">Valid</span>
                ) : (
                  <span className="text-red-600">Not Valid</span>
                )}
              </p>
            </div>
            {report.serviceHistory && (
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="text-sm font-medium text-gray-600 mb-1.5">Service History</h4>
                <p className="text-gray-900">{report.serviceHistory}</p>
              </div>
            )}
            {report.financeCheck && (
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="text-sm font-medium text-gray-600 mb-1.5">Finance Check</h4>
                <p className="text-gray-900">{report.financeCheck}</p>
              </div>
            )}
            {report.policeStolen && (
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="text-sm font-medium text-gray-600 mb-1.5">Police Report</h4>
                <p className="text-gray-900">{report.policeStolen}</p>
              </div>
            )}
            {typeof report.previousOwners !== 'undefined' && (
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="text-sm font-medium text-gray-600 mb-1.5">Previous Owners</h4>
                <p className="text-lg font-semibold text-gray-900">{report.previousOwners}</p>
              </div>
            )}
            {report.vehicleUsage && (
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="text-sm font-medium text-gray-600 mb-1.5">Vehicle Usage</h4>
                <p className="text-gray-900">{report.vehicleUsage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleHistoryLookup;
