import { Seller } from '../user/model.seller.js';
import { User } from '../user/model.js';
import { hashPassword } from '../../lib/security/hash.js';
import { ROLE } from '../../lib/auth/guards.js';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../../lib/db/sequelize.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { Industry } from '../systemConfigs/model/model.industry.js';
import { State } from '../systemConfigs/model/model.state.js';

export const createSellerService = async (req) => {
    try {
        const { user, seller } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email: user.email } });

        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        const createSeller = await Seller.create({
            businessName: seller.businessName,
            ntnCnic: seller.ntnCnic,
            businessNatureId: seller.businessNatureId,
            industryId: seller.industryId,
            address1: seller.address1,
            address2: seller.address2,
            city: seller.city,
            stateId: seller.stateId,
            postalCode: seller.postalCode,
            businessPhone: seller.businessPhone,
            businessEmail: seller.businessEmail,
            fbrSandBoxToken: seller.fbrSandBoxToken,
            fbrProdToken: seller.fbrProdToken,
            isActive: true
        });

        if(!createSeller){
            throw new Error('Failed to create seller');
        }

        console.log("sellerId", createSeller.id);
        const sellerId = createSeller.id;
        // Generate sellerCode with 5 zeros before the ID
        const sellerCode = sellerId.toString().slice(-6).padStart(6, '0');

        await createSeller.update({ sellerCode });

        const createUser = await User.create({ 
            email: user.email, 
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId, 
            passwordHash: await hashPassword(user.password), 
            sellerId: sellerId
        });

        const findSeller = await Seller.findOne({
            where: { id: createSeller.id },
            include: [{
                model: User,
                as: 'users',
                attributes: ['id', 'email', 'firstName', 'lastName', 'isActive']
            },
            {
                model: BusinessNature,
                as: 'businessNature',
                attributes: ['businessnature']
            },
            {
                model: Industry,
                as: 'industry',
                attributes: ['industryName']
            },
            {
                model: State,
                as: 'state',
                attributes: ['state']
            }]
        });

        return { 
            findSeller,
            createUser
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
                attributes: ['id', 'email', 'firstName', 'lastName', 'isActive']
            },
            {
                model: BusinessNature,
                as: 'businessNature',
                attributes: ['businessnature']
            },
            {
                model: Industry,
                as: 'industry',
                attributes: ['industryName']
            },
            {
                model: State,
                as: 'state',
                attributes: ['state']
            }]
        });

        // const sellersData = sellers.map(seller => {
        //     return {
        //         ...seller,
        //         businessNature: businessNatures.businessNature,
        //         industry: industries.industryName,
        //         state: states.state
        //     }
        // })

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