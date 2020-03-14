declare namespace Express {
    export interface Request {
        user?: {
            iss: string;
            sub: string;
            aud: string;
            iat: number;
            exp: number;
            azp: string;
            gty: string;
        };
    }
}
