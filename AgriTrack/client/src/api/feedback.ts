import api from './api';

export interface Feedback {
  _id: string;
  subject: string;
  category: 'bug_report' | 'feature_request' | 'general_feedback' | 'crop_recommendations';
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  response?: string;
}

// Description: Submit feedback
// Endpoint: POST /api/feedback
// Request: { subject: string, category: string, message: string }
// Response: { success: boolean, message: string, feedback: Feedback }
export const submitFeedback = (data: { subject: string; category: string; message: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Feedback submitted successfully',
        feedback: {
          _id: Date.now().toString(),
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Description: Get user's feedback history
// Endpoint: GET /api/feedback
// Request: {}
// Response: { feedback: Array<Feedback> }
export const getFeedback = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        feedback: [
          {
            _id: '1',
            subject: 'Great app!',
            category: 'general_feedback',
            message: 'Love the monthly recommendations feature',
            status: 'resolved',
            createdAt: '2024-02-15T10:00:00Z',
            response: 'Thank you for your positive feedback!'
          },
          {
            _id: '2',
            subject: 'Bug in task completion',
            category: 'bug_report',
            message: 'Tasks are not marking as complete sometimes',
            status: 'in_progress',
            createdAt: '2024-02-10T14:30:00Z'
          }
        ]
      });
    }, 500);
  });
};