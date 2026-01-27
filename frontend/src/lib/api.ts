/**
 * API client for Virtual Clinical Trial backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface TrialRequest {
  question: string;
  description?: string;
}

export interface TrialResponse {
  run_id: string;
  status: string;
  message: string;
}

export interface TrialStatus {
  run_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  question: string;
  created_at: string;
  completed_at?: string;
  run_folder?: string;
  error?: string;
}

export interface TrialResults {
  run_id: string;
  question: string;
  causal_question?: string;
  design_spec?: string;
  code?: string;
  omop_mappings?: string;
  validator_feedback?: string;
}

/**
 * Create a new virtual clinical trial
 */
export async function createTrial(request: TrialRequest): Promise<TrialResponse> {
  const response = await fetch(`${API_URL}/api/trials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create trial: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the status of a trial
 */
export async function getTrialStatus(runId: string): Promise<TrialStatus> {
  const response = await fetch(`${API_URL}/api/trials/${runId}/status`);

  if (!response.ok) {
    throw new Error(`Failed to get trial status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the results of a completed trial
 */
export async function getTrialResults(runId: string): Promise<TrialResults> {
  const response = await fetch(`${API_URL}/api/trials/${runId}/results`);

  if (!response.ok) {
    throw new Error(`Failed to get trial results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * List all trials
 */
export async function listTrials(): Promise<TrialStatus[]> {
  const response = await fetch(`${API_URL}/api/trials`);

  if (!response.ok) {
    throw new Error(`Failed to list trials: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a trial
 */
export async function deleteTrial(runId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/trials/${runId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete trial: ${response.statusText}`);
  }
}

/**
 * Check if the backend is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get example trials with their results
 */
export async function getExampleTrials(): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/examples`);

  if (!response.ok) {
    throw new Error(`Failed to get examples: ${response.statusText}`);
  }

  return response.json();
}
