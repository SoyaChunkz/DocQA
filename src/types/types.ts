
export interface AuthCallbackResponse {
    success: boolean;
}

export interface TRPCError {
    message: string; // add other relevant fields as needed
    data?: {
        code?: string; // make this optional
    };
}
