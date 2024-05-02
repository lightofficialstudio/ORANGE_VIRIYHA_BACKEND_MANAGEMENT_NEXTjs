import { CampaignCode } from './campaign';

export interface LocationTransactionStateProps {
  location_transaction: LocationTransactionType[];
  error: object | string | null;
}

export type LocationTransactionType = {
  id: number;
  code_id: number;
  id_card: string;
  latitude: number;
  longitude: number;
  status: string;
  usedAt: Date;
  code: CampaignCode;
};
