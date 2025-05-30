import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'ZEJS&Sqbx&B*wM8PQM';

export const sign = (key: string) => {
  return jwtSign(key, SECRET_KEY);
};

export const verify = (token: string) => {
  return new Promise((resolve, reject) => {
    jwtVerify(token, SECRET_KEY, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
};