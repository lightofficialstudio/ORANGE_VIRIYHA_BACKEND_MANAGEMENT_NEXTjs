export interface CategoryStateProps {
  category: CategoryType[];
  error: object | string | null;
}

type UserType = {
  username: string;
};

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