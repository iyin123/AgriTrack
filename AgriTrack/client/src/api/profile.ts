import api from './api';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  state: string;
  profilePicture?: string;
}

// Description: Get user profile
// Endpoint: GET /api/users/me
// Request: {}
// Response: { profile: UserProfile }
export const getProfile = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update user profile
// Endpoint: PUT /api/users/me
// Request: { firstName: string, lastName: string, farmName?: string, farmLocation?: string, farmSize?: string }
// Response: { success: boolean, message: string, profile: UserProfile }
export const updateProfile = async (data: { firstName: string; lastName: string; farmName?: string; farmLocation?: string; farmSize?: string }) => {
  try {
    const response = await api.put('/api/users/me', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Upload profile picture
// Endpoint: POST /api/profile/picture
// Request: FormData with 'picture' file
// Response: { success: boolean, message: string, profilePicture: string }
export const uploadProfilePicture = (file: File) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Profile picture uploaded successfully',
        profilePicture: URL.createObjectURL(file)
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const formData = new FormData();
  //   formData.append('picture', file);
  //   return await api.post('/api/profile/picture', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};