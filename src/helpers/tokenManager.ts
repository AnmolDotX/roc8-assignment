import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';

export const generateAccessToken = (user: any) => {
  return jwt.sign(user, accessTokenSecret, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: any) => {
  return jwt.sign(user, refreshTokenSecret, { expiresIn: '7d' });
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
}
