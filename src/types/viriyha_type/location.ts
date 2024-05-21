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
  code: CampaignCode;
  place: PlaceType;
  used_code?: string;
  location_name?: string;
  usedAt: Date;
};

export type PlaceType = {
  id: number;
  name: string;
};
