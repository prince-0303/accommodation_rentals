import axiosInstance from './axiosInstance';

export const aiSearch = async (query) => {
  const response = await axiosInstance.get('/search/ai/', {
    params: { q: query },
  });
  return response.data;
};
