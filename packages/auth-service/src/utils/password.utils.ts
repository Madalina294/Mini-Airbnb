import * as bcrypt from 'bcryptjs';

// Utilitare pentru hash-uirea parolelor

export class PasswordUtil {
  // Hash-uiește o parolă
  static async hash(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    return bcrypt.hash(password, rounds);
  } 

  // Verifică dacă parola se potrivește cu hash-ul
  static async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}