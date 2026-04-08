export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  education?: string;
  location?: string;
  skills: string[];
  experience: string;
  bio: string;
  createdAt?: any;
  updatedAt?: any;
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
  appliedDate?: any;
  createdAt?: any;
}

export interface GeneratedResponse {
  subject: string;
  email: string;
  whatsapp: string;
}

export type Tone = 'professional' | 'casual' | 'enthusiastic';
