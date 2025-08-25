import api from './api';

export interface DashboardStats {
  totalActiveCrops: number;
  upcomingTasks: number;
  completedTasksThisMonth: number;
  recentActivities: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
}

// Description: Get dashboard statistics
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { stats: DashboardStats }
export const getDashboardStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalActiveCrops: 12,
          upcomingTasks: 8,
          completedTasksThisMonth: 24,
          recentActivities: 15
        }
      });
    }, 500);
  });
};

// Description: Get weather data
// Endpoint: GET /api/dashboard/weather
// Request: {}
// Response: { weather: WeatherData }
export const getWeatherData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weather: {
          temperature: 28,
          condition: 'Sunny',
          humidity: 65,
          rainfall: 0
        }
      });
    }, 500);
  });
};