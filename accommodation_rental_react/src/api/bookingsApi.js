import axiosInstance from './axiosInstance';

export const getBookings = async () => {
  const response = await axiosInstance.get('/bookings/');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post('/bookings/', bookingData);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axiosInstance.patch(`/bookings/${id}/`, { status: 'cancelled' });
  return response.data;
};
