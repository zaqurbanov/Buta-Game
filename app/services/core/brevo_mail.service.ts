import env from '#start/env';
import axios, { AxiosResponse } from 'axios';

interface MailSender {
  name: string;
  email: string;
}

interface BrevoEmailPayload {
  to: Array<{ email: string; name?: string }>;
  sender: MailSender;
  subject: string;
  htmlContent: string;
}

interface BrevoResponse {
  messageId: string;
}

export class BrevoMailService {
  private apiKey: string;
  private baseURL: string = 'https://api.brevo.com/v3';
  private senderEmail: string;
  private senderName: string;

  constructor() {
    this.apiKey = (env.get('BREVO_API_KEY') || '').trim();
    this.senderEmail = env.get('BREVO_SENDER_EMAIL') || 'butagamestech@gmail.com';
    this.senderName = env.get('BREVO_SENDER_NAME') || 'Buta Game';

    if (!this.apiKey) throw new Error('BREVO_API_KEY is required');
    if (this.apiKey.startsWith('xsmtpsib-')) throw new Error('Wrong API key type. Need xkeysib- API key.');
  }

  async sendMail(to: string, subject: string, htmlContent: string): Promise<BrevoResponse> {
    const payload: BrevoEmailPayload = {
      to: [{ email: to }],
      sender: { name: this.senderName, email: this.senderEmail },
      subject,
      htmlContent,
    };

    const config = {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'api-key': this.apiKey },
      timeout: 10000,
    };

    try {
      const response: AxiosResponse<BrevoResponse> = await axios.post(`${this.baseURL}/smtp/email`, payload, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Brevo API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async verifySender(email: string): Promise<boolean> {
    try {
      const config = { headers: { Accept: 'application/json', 'api-key': this.apiKey } };
      const response = await axios.get(`${this.baseURL}/senders`, config);
      const senders = response.data.senders || [];
      return senders.some((s: any) => s.email === email && s.status === 'verified');
    } catch {
      return false;
    }
  }
}
