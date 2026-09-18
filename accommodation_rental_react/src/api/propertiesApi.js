import axiosInstance from './axiosInstance';

export const getProperties = async (params = {}) => {
  const response = await axiosInstance.get('/properties/', { params });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await axiosInstance.get(`/properties/${id}/`);
  return response.data;
};

export const getPropertiesNearby = async (lat, lng, radius_km = null) => {
  const params = { lat, lng };
  if (radius_km) params.radius_km = radius_km;
  const response = await axiosInstance.get('/properties/nearby/', { params });
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await axiosInstance.post('/properties/', propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await axiosInstance.patch(`/properties/${id}/`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await axiosInstance.delete(`/properties/${id}/`);
  return response.data;
};
