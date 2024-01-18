import axios from 'utils/axios';

export const getCategory = async () => {
  try {
    const response = await axios.get('/api/category');
    return response.data;
  } catch (error) {
    throw error;
  }
};
