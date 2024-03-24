export interface ErrorMessageStateProps {
  error_message: ErrorMessageType[];
  error: object | string | null;
}

export type ErrorMessageType = {
  id: number;
  code?: number;
  scenario?: string;
  set_message?: string;
};
