export interface UserBackendStateProps {
  user_backend: User_BackendType[];
  error: object | string | null;
}

export type User_BackendType = {
  id: number;
  image: string;
  username: string;
  email: string;
  name: string;
  phonenumber: string;
  password: string;
  role: string;
  status: string;
  serviceToken: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
