export type AuthResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  data?: unknown;
  user?: unknown;
  profile?: unknown;
  [key: string]: unknown;
};

export type RegisterPayload = {
  login: string;
  password: string;
  firstName: string;
  lastName?: string;
};

export type UserProfile = {
  id: string | number;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};
