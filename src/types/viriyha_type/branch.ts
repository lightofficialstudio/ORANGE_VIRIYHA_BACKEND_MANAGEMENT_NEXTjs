import { UserType } from './users';

export interface BranchStateProps {
  branch: BranchType[];
  error: object | string | null;
}

export type BranchType = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  shopId?: number;
  status: string;
  description?: string;
  createdById?: number;
  place: PlaceType;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: UserType;
};

export type PlaceType = {
  id: number;
  name: string;
};
