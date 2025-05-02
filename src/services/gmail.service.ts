
import { API_URL } from '@/lib/constant';

export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  labelIds: string[];
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  bodyType: string;
  attachments: any[];
  internalDate: string;
}

export interface EmailAccessResponse {
  hasAccess: boolean;
  reason?: string;
  profile?: any;
}

export interface Draft {
  id: string;
  message: EmailMessage;
}

export interface Label {
  id: string;
  name: string;
  type: string;
}

class GmailService {
  async checkAccess(): Promise<EmailAccessResponse> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/access`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to check Gmail access');
      }

      const responseData = await response.json();
      return {
        hasAccess: responseData.data?.hasAccess || false,
        reason: responseData.message,
        profile: responseData.data?.profile
      };
    } catch (error) {
      console.error('Error checking Gmail access:', error);
      return { hasAccess: false, reason: error.message };
    }
  }

  async requestAccess(): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/auth?source=gmail`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get Gmail auth URL');
      }

      const data = await response.json();
      if (!data.data || !data.data.authUrl) {
        throw new Error('Invalid auth URL returned from server');
      }
      
      window.location.href = data.data.authUrl;
      return data.data.authUrl;
    } catch (error) {
      console.error('Error requesting Gmail access:', error);
      throw error;
    }
  }

  async getEmails(params: any = {}): Promise<{ messages: EmailMessage[], nextPageToken?: string }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      
      const response = await fetch(`${API_URL}/api/gmail/messages?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const responseData = await response.json();
      return {
        messages: responseData.messages || [],
        nextPageToken: responseData.nextPageToken || null
      };
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  async getEmail(id: string): Promise<EmailMessage> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/messages/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch email');
      }

      const responseData = await response.json();
      return responseData.data?.email || responseData.data || responseData;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw error;
    }
  }

  async getEmailCount(params: any = {}): Promise<{ count: number }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      
      const response = await fetch(`${API_URL}/api/gmail/count?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch email count');
      }

      const responseData = await response.json();
      return { count: responseData.data?.count || 0 };
    } catch (error) {
      console.error('Error fetching email count:', error);
      return { count: 0 };
    }
  }

  async getLabels(): Promise<Label[]> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/labels`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch labels');
      }

      const responseData = await response.json();
      return responseData.data?.labels || [];
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  }

  async sendEmail(emailData: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async getDrafts(): Promise<{ drafts: Draft[] }> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/drafts`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }

      const responseData = await response.json();
      return responseData.data || { drafts: [] };
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  }

  async createDraft(emailData: any): Promise<Draft> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/drafts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to create draft');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<any> {
    return this.modifyEmail(id, { removeLabelIds: ['UNREAD'] });
  }

  async markAsUnread(id: string): Promise<any> {
    return this.modifyEmail(id, { addLabelIds: ['UNREAD'] });
  }

  async archiveEmail(id: string): Promise<any> {
    return this.modifyEmail(id, { removeLabelIds: ['INBOX'] });
  }

  async trashEmail(id: string): Promise<any> {
    return this.modifyEmail(id, { addLabelIds: ['TRASH'] });
  }

  async addLabel(id: string, labelId: string): Promise<any> {
    return this.modifyEmail(id, { addLabelIds: [labelId] });
  }

  async removeLabel(id: string, labelId: string): Promise<any> {
    return this.modifyEmail(id, { removeLabelIds: [labelId] });
  }

  private async modifyEmail(id: string, modifications: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/gmail/messages/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifications),
      });

      if (!response.ok) {
        throw new Error('Failed to modify email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error modifying email:', error);
      throw error;
    }
  }
}

export const gmailService = new GmailService();
