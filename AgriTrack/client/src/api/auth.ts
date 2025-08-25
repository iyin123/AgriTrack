import api from './api';

// Description: Login user functionality
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string, firstName: string, lastName: string, farmName?: string, farmLocation?: string, farmSize?: string, state: string }
// Response: { accessToken: string, refreshToken: string, email: string, firstName: string, lastName: string, farmName?: string, farmLocation?: string, farmSize?: string, state: string }
export const register = async (email: string, password: string, firstName: string, lastName: string, farmName?: string, farmLocation?: string, farmSize?: string, state?: string) => {
  try {
    const response = await api.post('/api/auth/register', {
      email, 
      password, 
      firstName, 
      lastName, 
      farmName, 
      farmLocation, 
      farmSize, 
      state
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  try {
    return await api.post('/api/auth/logout');
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};