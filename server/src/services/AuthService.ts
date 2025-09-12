import jwt from 'jsonwebtoken';

export class AuthService {
    private readonly jwtSecret: string;

    constructor(jwtSecret: string) {
        this.jwtSecret = jwtSecret;
    }

    async generateToken(userId: string, username:string, email: string) : Promise<string> {
        const payload = { userId, username, email };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: '30d' });
    }

    async verifyToken(token: string) : Promise<{ userId: string, username: string, email: string } | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string, username: string, email: string };
            return decoded;
        } catch (err) {
            return null;
        }
    }
}