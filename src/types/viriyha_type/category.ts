import { UserType } from './users';

export interface CategoryStateProps {
  category: CategoryType[];
  error: object | string | null;
}

export type CategoryType = {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserType; // ใช้ type UserType ที่สร้างขึ้น
};
