
export interface ErrorLogStateProps {
    error_log: ErrorLogType[];
    error: object | string | null;
}

export type ErrorLogType = {
    id: string;
    code: string;
    message: string;
    createdAt: Date;
};
