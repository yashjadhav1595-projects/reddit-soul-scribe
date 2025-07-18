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

export const analyzeRedditUser = async (username: string, exportPath?: string): Promise<AnalysisResult & { alert?: string }> => {
  try {
    const response = await api.post('/api/analyze', { username, exportPath });

    if (response.data.success) {
      const data = response.data.data;
      // Map simulated_post to simulatedPost for frontend compatibility
      return {
        ...data,
        simulatedPost: data.simulated_post || data.simulatedPost || '',
        alert: response.data.alert || undefined
      };
    } else {
      // If backend provides an alert, include it in the error
      const errorMsg = response.data.error || 'Analysis failed';
      const alertMsg = response.data.alert || undefined;
      const err: any = new Error(errorMsg);
      if (alertMsg) err.alert = alertMsg;
      throw err;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Backend responded with an error
        const alertMsg = error.response.data?.alert || undefined;
        const err: any = new Error(
          error.response.data?.error ||
          `Server error: ${error.response.status} ${error.response.statusText}`
        );
        if (alertMsg) err.alert = alertMsg;
        throw err;
      } else if (error.request) {
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

export const fetchRedditUserDetails = async (username: string): Promise<any> => {
  try {
    const response = await api.get(`/api/user/${encodeURIComponent(username)}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to fetch user details');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.error ||
          `Server error: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error('No response from backend. Is the server running?');
      } else {
        throw new Error('Request error: ' + error.message);
      }
    }
    throw new Error('Unexpected error: ' + (error?.message || error));
  }
};

export default api; 