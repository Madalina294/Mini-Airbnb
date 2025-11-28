import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.utils';
import { JwtUtil } from '../utils/jwt.utils';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';

export class AuthService {
    private userRepository: UserRepository;

  constructor(private prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
  }

    //register a new user
    async register(dto: RegisterDto): Promise<AuthResponse> {
    // 1. Verifică dacă email-ul există deja
    const emailExists = await this.userRepository.emailExists(dto.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    // 2. Hash-uiește parola
    const hashedPassword = await PasswordUtil.hash(dto.password);

    // 3. Creează user-ul
    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // 4. Generează JWT token
    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Returnează răspunsul (fără parolă)
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

    //login a user
    async login(dto: LoginDto): Promise<AuthResponse> {
    // 1. Găsește user-ul după email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Verifică parola
    const isPasswordValid = await PasswordUtil.compare(
      dto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // 3. Generează JWT token
    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Returnează răspunsul
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
    }
    
    // Validează un token (pentru alte servicii)
  async validateToken(token: string): Promise<{ userId: string; email: string; role: string }> {
    try {
      const payload = JwtUtil.verifyToken(token);
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}