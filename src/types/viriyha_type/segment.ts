import { UserType } from './users';

export interface SegmentStateProps {
  segment: SegmentType[];
  error: object | string | null;
}

export type SegmentType = {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserType;
  updatedBy: UserType;
};
