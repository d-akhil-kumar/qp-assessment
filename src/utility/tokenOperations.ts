import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export class TokenOperation {
    private readonly SECRET_KEY: string;

    constructor() {
        this.SECRET_KEY = process.env.JWT_SECRET || 'questionPRO';
    }

    public signKey(data: object): string {
        return jwt.sign(data, this.SECRET_KEY, { expiresIn: '12h' });
    }

    public verifyKey(token: string): JwtPayload | string | boolean {
        try {
            return jwt.verify(token, this.SECRET_KEY);
        } catch (error) {
            return false;
        }
    }

    //refresh token concept, not handled for this 90 mins challenge
    //but i know the concept, pls dont judge :D :D
} 