import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // TODO: Hash password check
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.json({ token: 'jwt-token-here', userId: user.id });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
};
export const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const user = await prisma.user.create({
            data: { email, name, password },
        });
        res.status(201).json({ message: 'User created', userId: user.id });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
};

export const logout = async (req, res) => {
    try {
        // Invalidate token logic here (if using token blacklist)
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
};
export default login;
