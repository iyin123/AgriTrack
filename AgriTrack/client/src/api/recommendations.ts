import api from './api';

export interface CropRecommendation {
  _id: string;
  name: string;
  type: string;
  description: string;
  plantingTips: string[];
  optimalPlantingDates: string;
  expectedHarvestTime: string;
  weatherConsiderations: string;
  icon: string;
}

export interface MonthlyRecommendation {
  _id: string;
  month: string;
  year: number;
  crops: CropRecommendation[];
  weatherForecast: string;
  generalTips: string[];
}

// Description: Get monthly crop recommendations
// Endpoint: GET /api/recommendations/monthly
// Request: {}
// Response: { recommendations: MonthlyRecommendation }
export const getMonthlyRecommendations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recommendations: {
          _id: '1',
          month: 'February',
          year: 2024,
          weatherForecast: 'Dry season continues with occasional light rains expected',
          generalTips: [
            'Focus on drought-resistant crops',
            'Ensure adequate irrigation systems',
            'Prepare for the upcoming rainy season'
          ],
          crops: [
            {
              _id: '1',
              name: 'Tomatoes',
              type: 'tomato',
              description: 'Perfect time to plant tomatoes for dry season harvest',
              plantingTips: [
                'Plant in well-drained soil',
                'Provide support stakes early',
                'Water regularly but avoid overwatering'
              ],
              optimalPlantingDates: 'February 15 - March 15',
              expectedHarvestTime: '90-120 days',
              weatherConsiderations: 'Thrives in current dry conditions',
              icon: '🍅'
            },
            {
              _id: '2',
              name: 'Pepper',
              type: 'pepper',
              description: 'Excellent choice for dry season planting',
              plantingTips: [
                'Choose sunny location',
                'Mulch around plants to retain moisture',
                'Regular feeding with organic fertilizer'
              ],
              optimalPlantingDates: 'February 1 - March 31',
              expectedHarvestTime: '75-90 days',
              weatherConsiderations: 'Heat tolerant, perfect for current weather',
              icon: '🌶️'
            },
            {
              _id: '3',
              name: 'Okra',
              type: 'okra',
              description: 'Fast-growing crop suitable for current conditions',
              plantingTips: [
                'Direct sow in garden',
                'Space plants 12 inches apart',
                'Harvest pods when young and tender'
              ],
              optimalPlantingDates: 'February 10 - April 30',
              expectedHarvestTime: '50-65 days',
              weatherConsiderations: 'Drought tolerant once established',
              icon: '🥒'
            }
          ]
        }
      });
    }, 500);
  });
};

// Description: Get recommendation history
// Endpoint: GET /api/recommendations/history
// Request: {}
// Response: { history: Array<MonthlyRecommendation> }
export const getRecommendationHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        history: [
          {
            _id: '2',
            month: 'January',
            year: 2024,
            weatherForecast: 'Dry season with harmattan winds',
            generalTips: ['Focus on irrigation', 'Protect crops from dust'],
            crops: []
          }
        ]
      });
    }, 500);
  });
};