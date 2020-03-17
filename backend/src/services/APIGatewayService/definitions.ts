import { IJWTToken, IServiceInvocationContext } from '../../definitions';

declare global {
    namespace Express {
        interface Request {
            user?: IJWTToken;
            context?: IServiceInvocationContext;
        }
    }
}
