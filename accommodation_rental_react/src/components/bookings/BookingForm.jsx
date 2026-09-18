import React, { useState } from 'react';
import { createBooking } from '../../api/bookingsApi';
import toast from 'react-hot-toast';

const BookingForm = ({ propertyId }) => {
  const [dates, setDates] = useState({ check_in: '', check_out: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(dates.check_out) <= new Date(dates.check_in)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    try {
      await createBooking({ property: propertyId, ...dates });
      toast.success('Booking confirmed successfully!');
      setDates({ check_in: '', check_out: '' });
    } catch (error) {
      console.error('Booking failed', error);
      const errData = error.response?.data;
      if (typeof errData === 'object') {
        const msg = Object.values(errData).flat().join(' ');
        toast.error(msg || 'Failed to book property');
      } else {
        toast.error('Failed to book property. It might be unavailable for these dates.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Book this property</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            name="check_in"
            required
            min={new Date().toISOString().split('T')[0]}
            value={dates.check_in}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
          <input
            type="date"
            name="check_out"
            required
            min={dates.check_in || new Date().toISOString().split('T')[0]}
            value={dates.check_out}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !dates.check_in || !dates.check_out}
          className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
