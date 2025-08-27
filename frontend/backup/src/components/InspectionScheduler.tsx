import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'inspection' | 'maintenance' | 'other';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerName: string;
  phone: string;
  email: string;
  vehicleDetails: string;
  notes: string;
}

const inspectionTypes = [
  { value: 'pre-purchase', label: 'Pre-Purchase Inspection' },
  { value: 'pre-rental', label: 'Pre-Rental Inspection' },
  { value: 'periodic', label: 'Periodic Maintenance Check' },
  { value: 'diagnostic', label: 'Diagnostic Inspection' },
];

const timeSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
];

const InspectionScheduler: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    customerName: '',
    phone: '',
    email: '',
    vehicleDetails: '',
    notes: '',
  });
  const [selectedType, setSelectedType] = useState('');

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // Check if the selected time is in the future and during business hours
    const now = new Date();
    const selected = new Date(start);
    
    // Check if selected time is in the past
    if (selected < now) {
      alert('Please select a future time slot');
      return;
    }
    
    // Check if it's a weekend
    const day = selected.getDay();
    if (day === 0 || day === 6) {
      alert('Please select a weekday (Monday to Friday)');
      return;
    }
    
    // Check if it's within business hours (9 AM to 5 PM)
    const hours = selected.getHours();
    if (hours < 9 || hours >= 17) {
      alert('Please select a time between 9 AM and 5 PM');
      return;
    }
    
    setSelectedSlot(start);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: `Inspection - ${formData.customerName}`,
      start: selectedSlot,
      end: new Date(selectedSlot.getTime() + 60 * 60 * 1000), // 1 hour duration
      type: 'inspection',
      status: 'pending',
      ...formData,
      type: selectedType as any,
    };
    
    setEvents([...events, newEvent]);
    setShowModal(false);
    // Reset form
    setFormData({
      type: '',
      customerName: '',
      phone: '',
      email: '',
      vehicleDetails: '',
      notes: '',
    });
    setSelectedType('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Schedule an Inspection</h2>
      
      <div className="bg-white rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="week"
          views={['week', 'day']}
          min={new Date(0, 0, 0, 9, 0, 0)} // 9 AM
          max={new Date(0, 0, 0, 17, 0, 0)} // 5 PM
          step={60} // 60 minutes
          timeslots={1}
          defaultDate={new Date()}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Inspection">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <div className="mt-1">
              {selectedSlot && moment(selectedSlot).format('MMMM Do YYYY, h:mm A')}
            </div>
          </div>
          
          <Select
            label="Inspection Type"
            name="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={inspectionTypes}
            required
          />
          
          <Input
            label="Your Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Vehicle Details"
            name="vehicleDetails"
            value={formData.vehicleDetails}
            onChange={handleInputChange}
            placeholder="Make, Model, Year, VIN (if available)"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Inspection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InspectionScheduler;
