import api from './api';

export interface Activity {
  _id: string;
  cropId: string;
  cropName: string;
  type: 'watering' | 'fertilizing' | 'weeding' | 'harvesting' | 'pest_control' | 'planting' | 'other';
  date: string;
  notes: string;
  photos?: string[];
}

// Description: Get all activities for the current user
// Endpoint: GET /api/activities
// Request: {}
// Response: { activities: Array<Activity> }
export const getActivities = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activities: [
          {
            _id: '1',
            cropId: '1',
            cropName: 'Tomatoes',
            type: 'watering',
            date: '2024-02-18',
            notes: 'Watered in the morning, soil was dry',
            photos: []
          },
          {
            _id: '2',
            cropId: '2',
            cropName: 'Pepper',
            type: 'fertilizing',
            date: '2024-02-17',
            notes: 'Applied organic compost around the base',
            photos: []
          },
          {
            _id: '3',
            cropId: '3',
            cropName: 'Okra',
            type: 'harvesting',
            date: '2024-02-16',
            notes: 'Harvested 2kg of fresh okra',
            photos: []
          }
        ]
      });
    }, 500);
  });
};

// Description: Add a new activity
// Endpoint: POST /api/activities
// Request: { cropId: string, type: string, date: string, notes: string, photos?: string[] }
// Response: { success: boolean, message: string, activity: Activity }
export const addActivity = (data: { cropId: string; type: string; date: string; notes: string; photos?: string[] }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Activity logged successfully',
        activity: {
          _id: Date.now().toString(),
          ...data,
          cropName: 'Selected Crop'
        }
      });
    }, 500);
  });
};

// Description: Delete an activity
// Endpoint: DELETE /api/activities/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteActivity = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Activity deleted successfully'
      });
    }, 500);
  });
};