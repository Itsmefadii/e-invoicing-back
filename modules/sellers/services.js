import { Seller } from '../user/model.seller.js';
import { User } from '../user/model.js';
import { hashPassword } from '../../lib/security/hash.js';
import { ROLE } from '../../lib/auth/guards.js';
import { v4 as uuidv4 } from 'uuid';

export const createSellerService = async (req) => {
    try {
        const { user, seller } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email: user.email } });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create seller
        const sellerId = uuidv4().replace(/-/g, '').slice(0, 32);
        
        // Generate sellerCode with 5 zeros before the ID
        const sellerCode = sellerId.slice(-6).padStart(6, '0');
        
        const createSeller = await Seller.create({
            id: sellerId,
            sellerCode,
            businessName: seller.businessName,
            ntnCnic: seller.ntnCnic,
            businessNatureId: seller.businessNatureId,
            industryId: seller.industryId,
            address1: seller.address1,
            address2: seller.address2,
            city: seller.city,
            state: seller.state,
            postalCode: seller.postalCode,
            businessPhone: seller.businessPhone,
            businessEmail: seller.businessEmail,
            fbrSandBoxToken: seller.fbrSandBoxToken,
            fbrProdToken: seller.fbrProdToken,
            // logoUrl: seller.logoUrl,
            isActive: true
        });

        if(!createSeller){
            throw new Error('Failed to create seller');
        }

        // Create user for seller
        const userId = uuidv4().replace(/-/g, '').slice(0, 32);
        await User.create({ 
            id: userId,
            email: user.email, 
            name: user.name, 
            role: ROLE.SELLER, 
            permissions: ['dashboard:view', 'invoices:view', 'reports:view', 'settings:view'],
            passwordHash: await hashPassword(user.password), 
            sellerId 
        });

        return { 
            id: userId, 
            sellerId,
            sellerCode,
            email: user.email,
            name: user.name,
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