import axiosInstance from './axiosInstance';

export const getUsers = async () => {
  const response = await axiosInstance.get('/auth/users/');
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.patch(`/auth/users/${id}/`, data);
  return response.data;
};
