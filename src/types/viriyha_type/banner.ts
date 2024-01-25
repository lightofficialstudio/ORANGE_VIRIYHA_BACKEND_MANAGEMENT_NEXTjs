import { UserType } from './users';

export interface BannerStateProps {
  banner: BannerManagementType[];
  error: object | string | null;
}

export type BannerManagementType = {
  id: number;
  name: string;
  image: string;
  link: string;
  status: string;
  view: number;
  position: number;
  description: string;
  createdById: number;
  updatedById: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserType;
};
