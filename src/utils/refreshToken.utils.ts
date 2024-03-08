import RefreshToken from '../models/refresh-token.model';
import { IRefreshToken } from '../types/refresh-token.types';

export async function generateAndStoreRefreshToken(userId: string, token: string, expiresIn: number): Promise<IRefreshToken> {
    const expirationDate = new Date(Date.now() + expiresIn);
    const refreshTokenDocument = new RefreshToken({
        user: userId,
        token,
        expiresAt: expirationDate,
    });
    await refreshTokenDocument.save();
    return refreshTokenDocument;
}
