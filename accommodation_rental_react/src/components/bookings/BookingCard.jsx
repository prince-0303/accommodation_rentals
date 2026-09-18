import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelBooking } from '../../api/bookingsApi';
import { Calendar, Home, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onCancelSuccess }) => {
  const [cancelling, setCancelling] = useState(false);
  const isConfirmed = booking.status === 'confirmed';
  const isPast = new Date(booking.check_in) < new Date();
  
  const canCancel = isConfirmed && !isPast;

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      toast.success('Booking cancelled successfully');
      if (onCancelSuccess) onCancelSuccess();
    } catch (error) {
      console.error('Failed to cancel booking', error);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = () => {
    if (booking.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Confirmed
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 md:justify-start md:gap-4">
            <h3 className="text-lg font-bold text-gray-900">
              Booking #{booking.id}
            </h3>
            {getStatusBadge()}
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start text-sm text-gray-600">
              <Home className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
              <div>
                <span className="block font-medium text-gray-900">Property</span>
                <Link to={`/properties/${booking.property}`} className="text-primary hover:underline">
                  View Property {booking.property}
                </Link>
              </div>
            </div>
            
            <div className="flex items-start text-sm text-gray-600">
              <Calendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
              <div>
                <span className="block font-medium text-gray-900">Dates</span>
                <span>{booking.check_in} to {booking.check_out}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            Booked on: {new Date(booking.created_at).toLocaleDateString()}
          </div>
        </div>

        {canCancel && (
          <div className="mt-4 md:mt-0 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className={`w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${cancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
