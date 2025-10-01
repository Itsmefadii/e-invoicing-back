import { createSellerService, fetchSellersService, updateSellerService } from "./services.js";
import { ROLE } from "../../lib/auth/guards.js";
import { sendCreated, sendError, sendSuccess, sendNotFoundError } from "../../lib/utils/response.js";

export const createSellerController = async (req, reply) => {
    try {
        console.log(req.user.roleName);
        if(req.user.roleName !== "Admin"){
            return sendError(reply, 'You are not authorized to create a seller', 403);
        }

        if(!req.body){
            return sendError(reply, 'Request body is required', 400);
        }

        const result = await createSellerService(req)

        if(!result){
            throw new Error('Failed to create seller');
        }

        return sendCreated(reply, result, 'Seller created successfully');
    } catch (error) {
        return sendError(reply, error.message, 500);
    }
}

export const updateSellerController = async (req, reply) => {
    try {
        if(req.user.roleName !== ROLE.ADMIN){
            return sendError(reply, 'You are not authorized to update a seller', 403);
        }

        const result = await updateSellerService(req);

        if(!result){
            throw new Error('Failed to update seller');
        }

        return sendSuccess(reply, result, 'Seller updated successfully');
    } catch (error) {
        if (error.message === 'Seller not found') {
            return sendNotFoundError(reply, error.message);
        }
        return sendError(reply, error.message, 500);
    }
}

export const fetchSellersController = async (req, reply) => {
    try {
        if(req.user.roleName !== ROLE.ADMIN){
            return sendError(reply, 'You are not authorized to view sellers', 403);
        }

        const result = await fetchSellersService(req);

        if(!result){
            throw new Error('Failed to fetch sellers');
        }

        return sendSuccess(reply, result, 'Sellers fetched successfully');
    } catch (error) {
        return sendError(reply, error.message, 500);
    }
}