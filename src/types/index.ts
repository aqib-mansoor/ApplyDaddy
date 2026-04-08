import { Timestamp } from 'firebase/firestore';

export type Tone = 'professional' | 'casual' | 'enthusiastic';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  skills: string[]; // Chips/Tags system
  experienceSummary: string;
  education: string;
  updatedAt: any;
  createdAt?: any;
}

export interface Application {
  id: string;
  userId: string;
  jobPostText: string;
  companyName: string;
  jobTitle: string;
  generatedEmail: {
    subject: string;
    body: string;
  };
  generatedWhatsapp: string;
  status: 'pending' | 'applied' | 'interview' | 'rejected' | 'accepted';
  appliedDate: any;
}

export interface GeneratedResponse {
  subject: string;
  email: string;
  whatsapp: string;
}
