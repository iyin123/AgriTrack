import api from './api';

export interface Task {
  _id: string;
  cropId: string;
  cropName: string;
  title: string;
  type: 'watering' | 'fertilizing' | 'weeding' | 'harvesting' | 'pest_control' | 'custom';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

// Description: Get all tasks for the current user
// Endpoint: GET /api/tasks
// Request: {}
// Response: { tasks: Array<Task> }
export const getTasks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tasks: [
          {
            _id: '1',
            cropId: '1',
            cropName: 'Tomatoes',
            title: 'Water tomatoes',
            type: 'watering',
            dueDate: '2024-02-20',
            priority: 'high',
            completed: false,
            notes: 'Water early morning'
          },
          {
            _id: '2',
            cropId: '2',
            cropName: 'Pepper',
            title: 'Apply fertilizer',
            type: 'fertilizing',
            dueDate: '2024-02-22',
            priority: 'medium',
            completed: false,
            notes: 'Use organic fertilizer'
          },
          {
            _id: '3',
            cropId: '1',
            cropName: 'Tomatoes',
            title: 'Check for pests',
            type: 'pest_control',
            dueDate: '2024-02-18',
            priority: 'medium',
            completed: true,
            notes: 'No pests found'
          }
        ]
      });
    }, 500);
  });
};

// Description: Add a new task
// Endpoint: POST /api/tasks
// Request: { cropId: string, title: string, type: string, dueDate: string, priority: string, notes?: string }
// Response: { success: boolean, message: string, task: Task }
export const addTask = (data: { cropId: string; title: string; type: string; dueDate: string; priority: string; notes?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Task added successfully',
        task: {
          _id: Date.now().toString(),
          ...data,
          cropName: 'Selected Crop',
          completed: false
        }
      });
    }, 500);
  });
};

// Description: Update task completion status
// Endpoint: PUT /api/tasks/:id/complete
// Request: { completed: boolean }
// Response: { success: boolean, message: string }
export const updateTaskCompletion = (id: string, completed: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: completed ? 'Task marked as completed' : 'Task marked as incomplete'
      });
    }, 500);
  });
};

// Description: Delete a task
// Endpoint: DELETE /api/tasks/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteTask = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Task deleted successfully'
      });
    }, 500);
  });
};