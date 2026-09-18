import React, { useState, useEffect } from 'react';
import { getBookings } from '../api/bookingsApi';
import BookingCard from '../components/bookings/BookingCard';
import { Bookmark, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      // Sort by newest first (created_at desc)
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBookings(sorted);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Bookmark className="h-8 w-8 mr-3 text-primary" />
            My Bookings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your past and upcoming property reservations.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onCancelSuccess={fetchBookings} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500 max-w-sm mx-auto">
              You haven't made any property reservations yet. Start exploring properties to book your next stay!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
