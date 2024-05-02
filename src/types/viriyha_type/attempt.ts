import { CampaignType } from './campaign';
export interface AttemptTransactionStateProps {
  attempt_transaction: AttemptTransactionType[];
  error: object | string | null;
}

export type AttemptTransactionType = {
  id: number;
  campaign_id: number;
  message: string;
  createdAt: Date;
  Campaign: CampaignType;
};
