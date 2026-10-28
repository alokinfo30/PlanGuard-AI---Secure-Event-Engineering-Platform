export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  role: 'Host' | 'Guest' | 'Administrator';
  avatar: string;
  verified: boolean;
  tenantId: string;
}

export const GOOGLE_CLIENT_ID = '188621645679-srodtpq1n1fm85cfqhb97b6mmrd1o1hf.apps.googleusercontent.com';
export const GOOGLE_PROJECT_ID = '188621645679';

export const PRECONFIGURED_TEST_ACCOUNTS: GoogleUser[] = [
  {
    id: 'user_enterprise_corp',
    email: 'alokinfo.proict@gmail.com',
    name: 'Alok (Global Tech Summit)',
    role: 'Host',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_enterprise_corp',
  },
  {
    id: 'user_secure_alice',
    email: 'alokinfo30@gmail.com',
    name: 'Alice & David (Botanical Wedding)',
    role: 'Guest',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_secure_alice',
  },
  {
    id: 'user_alokinfo_proict_bday',
    email: 'alokinfo.proict@gmail.com',
    name: 'Marcus (30th Cyberpunk Birthday)',
    role: 'Host',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_alokinfo_proict',
  },
  {
    id: 'user_alokinfo30_comm',
    email: 'alokinfo30@gmail.com',
    name: 'Greenwood (Spring Community Fest)',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_alokinfo30',
  },
];

export const AUTHORIZED_ORIGINS = [
  'https://ais-dev-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
  'https://ais-pre-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
  'https://ais-dev-mthhzeqnq5vzzabg4gqj2o-440468285390.asia-east1.run.app',
  'https://ais-pre-mthhzeqnq5vzzabg4gqj2o-440468285390.asia-east1.run.app',
  'http://localhost:3000',
];
