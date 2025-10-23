// Retell AI API Integration

const RETELL_API_URL = process.env.NEXT_PUBLIC_RETELL_API_URL || 'https://api.retellai.com/v1';
const RETELL_API_KEY = process.env.RETELL_API_KEY;

export interface RetellCall {
  call_id: string;
  agent_id: string;
  call_status: 'registered' | 'ongoing' | 'ended' | 'error';
  call_type: 'web_call' | 'phone_call';
  from_number?: string;
  to_number?: string;
  direction: 'inbound' | 'outbound';
  start_timestamp: number;
  end_timestamp?: number;
  transcript?: string;
  recording_url?: string;
  metadata?: Record<string, any>;
}

export interface CallsResponse {
  calls: RetellCall[];
  has_more: boolean;
  next_cursor?: string;
}

class RetellAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = RETELL_API_KEY || '';
    this.baseUrl = RETELL_API_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Retell API key not configured. Please add RETELL_API_KEY to your .env.local file');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Retell API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get list of calls
  async getCalls(params?: {
    limit?: number;
    cursor?: string;
    filter_criteria?: {
      agent_id?: string;
      before_start_timestamp?: number;
      after_start_timestamp?: number;
    };
  }): Promise<CallsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.filter_criteria) {
      queryParams.append('filter_criteria', JSON.stringify(params.filter_criteria));
    }

    return this.makeRequest<CallsResponse>(
      `/list-calls?${queryParams.toString()}`
    );
  }

  // Get single call details
  async getCall(callId: string): Promise<RetellCall> {
    return this.makeRequest<RetellCall>(`/get-call/${callId}`);
  }

  // Get call recording
  async getCallRecording(callId: string): Promise<{ recording_url: string }> {
    return this.makeRequest<{ recording_url: string }>(
      `/get-call-recording/${callId}`
    );
  }

  // Get call transcript
  async getCallTranscript(callId: string): Promise<{ transcript: string }> {
    return this.makeRequest<{ transcript: string }>(
      `/get-call-transcript/${callId}`
    );
  }
}

// Export singleton instance
export const retellAPI = new RetellAPI();

// Helper function to format calls for dashboard
export function formatCallForDashboard(call: RetellCall) {
  return {
    id: call.call_id,
    callerName: call.metadata?.caller_name || 'Unbekannt',
    callerPhone: call.from_number || 'N/A',
    duration: call.end_timestamp && call.start_timestamp
      ? formatDuration(call.end_timestamp - call.start_timestamp)
      : '0:00',
    timestamp: new Date(call.start_timestamp * 1000),
    status: call.call_status === 'ended' ? 'answered' : 'missed',
    transcript: call.transcript,
    summary: call.metadata?.summary,
  };
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
