import { Seller } from '../user/model.seller.js';
import { User } from '../user/model.js';
import { hashPassword } from '../../lib/security/hash.js';
import { ROLE } from '../../lib/auth/guards.js';
import { v4 as uuidv4 } from 'uuid';

export const createSellerService = async (req) => {
    try {
        const { email, name, password } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create seller
        const sellerId = uuidv4().replace(/-/g, '').slice(0, 32);
        await Seller.create({ 
            id: sellerId, 
            name,
            email,
            isActive: true
        });

        // Create user for seller
        const userId = uuidv4().replace(/-/g, '').slice(0, 32);
        await User.create({ 
            id: userId, 
            email, 
            name, 
            role: ROLE.SELLER, 
            permissions: ['dashboard:view', 'invoices:view', 'reports:view', 'settings:view'],
            passwordHash: await hashPassword(password), 
            sellerId 
        });

        return { 
            id: userId, 
            sellerId,
            email,
            name,
            role: ROLE.SELLER
        };
    } catch (error) {
        throw new Error(`Failed to create seller: ${error.message}`);
    }
}

export const fetchSellersService = async (req) => {
    try {
        const sellers = await Seller.findAll({
            where: { isActive: true },
            include: [{
                model: User,
                as: 'users',
                attributes: ['id', 'email', 'name', 'isActive']
            }]
        });
        return sellers;
    } catch (error) {
        throw new Error(`Failed to fetch sellers: ${error.message}`);
    }
}

export const updateSellerService = async (req) => {
    try {
        const { id } = req.params;
        const { name, email, isActive } = req.body;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            throw new Error('Seller not found');
        }

        await seller.update({ name, email, isActive });
        return seller;
    } catch (error) {
        throw new Error(`Failed to update seller: ${error.message}`);
    }
}