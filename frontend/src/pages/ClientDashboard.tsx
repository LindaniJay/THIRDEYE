import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCheckCircle, faClock, faDollarSign } from '@fortawesome/free-solid-svg-icons';

interface Inspection {
  id: string;
  date: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  vehicle: string;
  cost: number;
}

const ClientDashboard: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockInspections: Inspection[] = [
        {
          id: 'INSP-001',
          date: '2023-06-15',
          type: 'Pre-Purchase',
          status: 'scheduled',
          vehicle: '2020 Toyota RAV4',
          cost: 199.99
        },
        {
          id: 'INSP-002',
          date: '2023-06-10',
          type: 'Annual',
          status: 'completed',
          vehicle: '2018 Honda Civic',
          cost: 149.99
        }
      ];
      
      setInspections(mockInspections);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const renderStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'scheduled': return <span className={`${base} bg-blue-100 text-blue-800`}>Scheduled</span>;
      case 'in-progress': return <span className={`${base} bg-yellow-100 text-yellow-800`}>In Progress</span>;
      case 'completed': return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
      case 'cancelled': return <span className={`${base} bg-red-100 text-red-800`}>Cancelled</span>;
      default: return <span className={`${base} bg-gray-100`}>{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const upcoming = inspections.find(i => i.status === 'scheduled');
  const completed = inspections.filter(i => i.status === 'completed');
  const totalSpent = completed.reduce((sum, i) => sum + i.cost, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<FontAwesomeIcon icon={faCalendar} className="h-6 w-6" />} 
            title="Upcoming" 
            value={inspections.filter(i => i.status === 'scheduled').length}
            color="blue"
          />
          <StatCard 
            icon={<FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6" />} 
            title="Completed" 
            value={completed.length}
            color="green"
          />
          <StatCard 
            icon={<FontAwesomeIcon icon={faClock} className="h-6 w-6" />} 
            title="In Progress" 
            value={inspections.filter(i => i.status === 'in-progress').length}
            color="yellow"
          />
          <StatCard 
            icon={<FontAwesomeIcon icon={faDollarSign} className="h-6 w-6" />} 
            title="Total Spent" 
            value={`$${totalSpent.toFixed(2)}`}
            color="indigo"
          />
        </div>

        {upcoming && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Inspection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(upcoming.date).toDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">{upcoming.vehicle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{upcoming.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {renderStatusBadge(upcoming.status)}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Inspections</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inspection.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inspection.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(inspection.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${inspection.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: string | number;
  color?: 'blue' | 'green' | 'yellow' | 'indigo' | 'gray';
}

const StatCard = ({ icon, title, value, color = 'gray' }: StatCardProps) => {
  const colorMap = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
    green: { bg: 'bg-green-500', text: 'text-green-500' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500' },
    gray: { bg: 'bg-gray-500', text: 'text-gray-500' }
  } as const;

  const iconWithClass = React.cloneElement(icon, {
    // @ts-ignore - The FontAwesomeIcon component accepts a className prop
    className: `${colorMap[color].text} h-6 w-6`
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorMap[color].bg} bg-opacity-10`}>
          {iconWithClass}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
