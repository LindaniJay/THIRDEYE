import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCar, 
  faScrewdriverWrench, 
  faGasPump, 
  faDollarSign, 
  faCircleInfo 
} from '@fortawesome/free-solid-svg-icons';

// South African vehicle makes and models
const MAKES = [
  'Toyota', 'Volkswagen', 'Hyundai', 'Ford', 'Nissan',
  'Isuzu', 'Kia', 'Suzuki', 'Renault', 'Mercedes-Benz',
  'BMW', 'Haval', 'Mahindra', 'Chery', 'GWM'
];

const MODELS: Record<string, string[]> = {
  'Toyota': ['Hilux', 'Fortuner', 'Corolla Cross', 'Urban Cruiser', 'Starlet'],
  'Volkswagen': ['Polo', 'Polo Vivo', 'T-Cross', 'T-Roc', 'Amarok'],
  'Hyundai': ['i20', 'Creta', 'Venue', 'Tucson', 'Grand i10'],
  'Ford': ['Ranger', 'EcoSport', 'Puma', 'Everest', 'Figo'],
  'Nissan': ['NP200', 'Navara', 'X-Trail', 'Qashqai', 'Magnite'],
  'Isuzu': ['D-Max', 'MU-X'],
  'Kia': ['Seltos', 'Sonet', 'Sorento', 'Picanto', 'Soul'],
  'Suzuki': ['Swift', 'Vitara Brezza', 'Jimny', 'Ertiga', 'Baleno'],
  'Renault': ['Kwid', 'Kiger', 'Duster', 'Triber', 'Koleos'],
  'Mercedes-Benz': ['C-Class', 'A-Class', 'GLC', 'GLE', 'GLA'],
  'BMW': ['3 Series', 'X3', 'X5', '1 Series', 'X1'],
  'Haval': ['Jolion', 'H6', 'Dargo'],
  'Mahindra': ['Scorpio', 'XUV700', 'Thar', 'Bolero'],
  'Chery': ['Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro'],
  'GWM': ['P-Series', 'Haval Jolion', 'Haval H6']
};

// Annual maintenance cost estimates in ZAR
const MAINTENANCE_COSTS: Record<string, number> = {
  'Toyota': 8000,
  'Volkswagen': 10000,
  'Hyundai': 8500,
  'Ford': 9500,
  'Nissan': 9000,
  'Isuzu': 11000,
  'Kia': 9000,
  'Suzuki': 7500,
  'Renault': 8500,
  'Mercedes-Benz': 18000,
  'BMW': 20000,
  'Haval': 9500,
  'Mahindra': 8000,
  'Chery': 8500,
  'GWM': 9000,
  'Luxury': 15000,
  'Default': 10000
};

// Annual fuel cost estimates in ZAR (based on 25,000 km/year)
const FUEL_COSTS: Record<string, number> = {
  'Hatchback': 36000,
  'Sedan': 42000,
  'SUV': 48000,
  'Bakkie': 54000,
  'Luxury': 60000,
  'Electric': 18000
};

// Annual insurance cost estimates in ZAR
const INSURANCE_COSTS: Record<string, number> = {
  'Hatchback': 12000,
  'Midsize': 1400,
  'SUV': 1600,
  'Truck': 1800,
  'Luxury': 2500
};

// Depreciation estimates (percentage of MSRP per year)
const DEPRECIATION_RATES: Record<string, number> = {
  'Economy': 15,
  'Midsize': 18,
  'SUV': 20,
  'Truck': 17,
  'Luxury': 25
};


const MaintenanceCostCalculator: React.FC = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [mileage, setMileage] = useState<number>(25000);
  const [msrp, setMsrp] = useState<number>(350000);
  const [vehicleType, setVehicleType] = useState<string>('Hatchback');
  const [yearsOwned, setYearsOwned] = useState(5);
  
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [results, setResults] = useState<{
    maintenanceCost: number;
    fuelCost: number;
    insuranceCost: number;
    depreciation: number;
    totalCost: number;
    costPerMile: number;
  } | null>(null);

  // Update available models when make changes
  useEffect(() => {
    if (make && MODELS[make]) {
      setAvailableModels(MODELS[make]);
      setModel('');
    } else {
      setAvailableModels([]);
      setModel('');
    }
  }, [make]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!make || !vehicleType) return;

    // Get base maintenance cost (simplified for demo)
    const baseMaintenanceCost = MAINTENANCE_COSTS[make] || MAINTENANCE_COSTS['Default'];
    const maintenanceCost = baseMaintenanceCost * yearsOwned;
    
    // Get fuel cost
    const fuelCost = (FUEL_COSTS[vehicleType] || 0) * yearsOwned;
    
    // Get insurance cost
    const insuranceCost = (INSURANCE_COSTS[vehicleType] || 0) * yearsOwned;
    
    // Calculate depreciation
    const depreciationRate = (DEPRECIATION_RATES[vehicleType] || 0) / 100;
    let remainingValue = msrp;
    let totalDepreciation = 0;
    
    for (let i = 0; i < yearsOwned; i++) {
      const yearDepreciation = remainingValue * depreciationRate;
      totalDepreciation += yearDepreciation;
      remainingValue -= yearDepreciation;
    }
    
    // Calculate total cost per mile
    const totalMiles = mileage * yearsOwned;
    const totalCost = maintenanceCost + fuelCost + insuranceCost + totalDepreciation;
    const costPerMile = totalCost / totalMiles;
    
    setResults({
      maintenanceCost,
      fuelCost,
      insuranceCost,
      depreciation: totalDepreciation,
      totalCost,
      costPerMile
    });
  }, [make, vehicleType, mileage, msrp, yearsOwned]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const years = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-6 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Vehicle Information</h3>
          
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-800 mb-1">
              Make <span className="text-red-500">*</span>
            </label>
            <select
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-200"
              required
            >
              <option value="">Select Make</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-800 mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-200"
              disabled={!make}
              required
            >
              <option value="" className="text-gray-900">Select Model</option>
              {availableModels.map((m) => (
                <option key={m} value={m} className="text-gray-900">
                  {m}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-800 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={1990}
                max={new Date().getFullYear() + 1}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-800 mb-1">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-200"
                required
              >
                {['Hatchback', 'Sedan', 'SUV', 'Bakkie', 'Luxury', 'Electric'].map((type) => (
                  <option key={type} value={type} className="text-gray-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Vehicle Price (ZAR)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700">
                R
              </span>
              <input
                type="number"
                value={msrp}
                onChange={(e) => setMsrp(Number(e.target.value))}
                className="block w-full pl-8 pr-12 py-2.5 border border-gray-300 bg-white/90 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="0.00"
                min="0"
                step="1000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Annual Mileage</label>
              <div className="relative">
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="block w-full pr-12 py-2.5 border border-gray-300 bg-white/90 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="0"
                  min="0"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                  km
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Years of Ownership</label>
              <div className="mt-1">
                <select
                  id="yearsOwned"
                  value={yearsOwned}
                  onChange={(e) => setYearsOwned(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-200"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="text-gray-900">
                      {y} year{y !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50/80 p-4 rounded-lg border border-blue-100">
            <div className="flex">
              <FontAwesomeIcon icon={faCircleInfo} className="w-4 h-4 text-gray-400" />
              <p className="ml-3 text-sm text-blue-800">
                This calculator provides estimates based on average costs. Your actual costs may vary based on location, driving habits, and vehicle condition.
              </p>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Estimated Ownership Costs</h3>
          
          {results ? (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Estimated Annual Costs (ZAR)</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Cost of Ownership</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(results.totalCost)}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatCurrency(results.costPerMile)} per km over {yearsOwned} {yearsOwned === 1 ? 'year' : 'years'}
                    </p>
                  </div>
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Cost Breakdown</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faScrewdriverWrench} className="w-5 h-5 text-blue-500" />
                      <span>Maintenance & Repairs</span>
                    </div>
                    <span>{formatCurrency(results.maintenanceCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faGasPump} className="w-5 h-5 text-blue-500" />
                      <span>Fuel</span>
                    </div>
                    <span>{formatCurrency(results.fuelCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-blue-500" />
                      <span>Insurance</span>
                    </div>
                    <span>{formatCurrency(results.insuranceCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Depreciation</span>
                    </div>
                    <span>-{formatCurrency(results.depreciation)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(results.totalCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      These are estimates only. Actual costs may vary based on your specific vehicle, location, and driving habits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faCar} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
              <p className="mt-1 text-sm text-gray-500">Enter your vehicle details to see cost estimates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCostCalculator;
