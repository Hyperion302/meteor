import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const authMiddleware = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-swish.auth0.com/.well-known/jwks.json`,
    }),

    audience: 'backend',
    issuer: `https://dev-swish.auth0.com/`,
    algorithms: ['RS256'],
});

export default authMiddleware;
