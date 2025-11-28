import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

export class JwtUtil {
  private static readonly SECRET = process.env.JWT_SECRET || 'default-secret';
  private static readonly EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(
      payload as object,
      this.SECRET,
      { expiresIn: this.EXPIRES_IN } as jwt.SignOptions
    );
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}