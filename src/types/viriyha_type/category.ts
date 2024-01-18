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
  status: number;
};
