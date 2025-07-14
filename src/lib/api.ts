import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PersonaData {
  name: string;
  age: string;
  location: string;
  occupation: string;
  interests: string[];
  personality: string[];
  political_view: string;
  lifestyle: string;
  communication_style: string;
  values: string[];
  archetype: string;
  narrative: string;
}

export interface Citation {
  text: string;
  source: string;
  subreddit: string;
  score: number;
}

export interface RedditData {
  username: string;
  totalPosts: number;
  totalComments: number;
}

export interface AnalysisResult {
  persona: PersonaData;
  citations: Record<string, Citation>;
  redditData: RedditData;
  personaImage?: string;
  simulatedPost?: string;
}

export const analyzeRedditUser = async (username: string): Promise<AnalysisResult> => {
  try {
    const response = await api.post('/api/analyze', { username });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Analysis failed');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Backend responded with an error
        throw new Error(
          error.response.data?.error ||
          `Server error: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        // No response from backend
        throw new Error('No response from backend. Is the server running?');
      } else {
        throw new Error('Request error: ' + error.message);
      }
    }
    throw new Error('Unexpected error: ' + (error?.message || error));
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/health');
    return response.data.status === 'OK';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default api; 