import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { appConfig } from '@/sharedInstances';

const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: appConfig.auth.jwks_uri,
  }),

  audience: appConfig.auth.jwt_audience,
  // issuer: appConfig.auth.jwt_issuer,
  algorithms: ['RS256'],
});

export default authMiddleware;
