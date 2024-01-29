import { UserType } from './users';

export interface BranchStateProps {
  branch: BranchType[];
  error: object | string | null;
}

export type BranchType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  shopId: number;
  status: string;
  description: string;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserType;
};
