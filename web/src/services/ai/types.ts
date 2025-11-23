/**
 * Data Transfer Object for creating a new AI interview.
 */
export interface CreateAiInterviewDto {
  /** The type of interview (e.g., 'technical', 'behavioral') */
  type: string;
  /** The language in which the interview will be conducted */
  language: string;
  /** Optional initial status of the interview */
  status?: string;
}

/**
 * Response object returned when an AI interview is created.
 */
export interface AiInterviewResponse {
  /** Unique identifier for the created interview */
  interviewID: string;
  /** WebSocket endpoint URL to connect to for the interview session */
  entrypoint: string;
}

/**
 * Data Transfer Object for updating an existing AI interview.
 */
export interface UpdateAiInterviewDto {
  /** Updated status of the interview */
  status?: 'asked' | 'in_progress' | 'completed' | 'cancelled';
  /** Score assigned to the interview (if applicable) */
  score?: number;
  /** Feedback text for the interview */
  feedback?: string;
  /** URL link to the recorded video of the interview */
  videoLink?: string;
}
