import { UserType } from './users';

export interface CriteriaStateProps {
  criteria: CriteriaType[];
  error: object | string | null;
}

export type CriteriaType = {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserType;
  updatedBy: UserType;
};
