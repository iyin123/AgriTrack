import api from './api';

export interface Crop {
  _id: string;
  name: string;
  type: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'healthy' | 'attention' | 'overdue';
  notes: string;
  bestPlantingSeason: string;
  daysUntilHarvest: number;
}

// Description: Get all crops for the current user
// Endpoint: GET /api/crops
// Request: {}
// Response: { crops: Array<Crop> }
export const getCrops = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        crops: [
          {
            _id: '1',
            name: 'Tomatoes',
            type: 'tomato',
            plantingDate: '2024-01-15',
            expectedHarvestDate: '2024-04-15',
            status: 'healthy',
            notes: 'Growing well, regular watering needed',
            bestPlantingSeason: 'Dry season',
            daysUntilHarvest: 45
          },
          {
            _id: '2',
            name: 'Pepper',
            type: 'pepper',
            plantingDate: '2024-02-01',
            expectedHarvestDate: '2024-05-01',
            status: 'attention',
            notes: 'Some yellowing leaves, check for pests',
            bestPlantingSeason: 'Dry season',
            daysUntilHarvest: 60
          },
          {
            _id: '3',
            name: 'Okra',
            type: 'okra',
            plantingDate: '2024-01-20',
            expectedHarvestDate: '2024-03-20',
            status: 'overdue',
            notes: 'Ready for harvest',
            bestPlantingSeason: 'Rainy season',
            daysUntilHarvest: -5
          }
        ]
      });
    }, 500);
  });
};

// Description: Add a new crop
// Endpoint: POST /api/crops
// Request: { name: string, type: string, plantingDate: string, notes: string }
// Response: { success: boolean, message: string, crop: Crop }
export const addCrop = (data: { name: string; type: string; plantingDate: string; notes: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Crop added successfully',
        crop: {
          _id: Date.now().toString(),
          ...data,
          expectedHarvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'healthy',
          bestPlantingSeason: 'Current season',
          daysUntilHarvest: 90
        }
      });
    }, 500);
  });
};

// Description: Update a crop
// Endpoint: PUT /api/crops/:id
// Request: { name: string, type: string, plantingDate: string, notes: string }
// Response: { success: boolean, message: string, crop: Crop }
export const updateCrop = (id: string, data: { name: string; type: string; plantingDate: string; notes: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Crop updated successfully',
        crop: { _id: id, ...data, status: 'healthy', bestPlantingSeason: 'Current season', daysUntilHarvest: 90 }
      });
    }, 500);
  });
};

// Description: Delete a crop
// Endpoint: DELETE /api/crops/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCrop = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Crop deleted successfully'
      });
    }, 500);
  });
};