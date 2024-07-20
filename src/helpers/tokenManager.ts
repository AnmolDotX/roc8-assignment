import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "accessTokenSecret"
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "refreshTokenSecret"

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const generateAccessToken = (user: User) => {
  return jwt.sign({
    userId : user.id,
    email : user.email,
    name : user.name
  }, accessTokenSecret, { expiresIn: '1d' });
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign({
    userId : user.id,
    email : user.email,
    name : user.name
  }, refreshTokenSecret, { expiresIn: '7d' });
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
}
