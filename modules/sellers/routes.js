import { createSellerController, updateSellerController, fetchSellersController } from './controller.js';

export const sellersRoutes = (fastify, options, done) => {
    fastify.route({
      method: ["GET", "POST", "PUT"],
      url: "/:id?",
      handler: (req, reply) => {
        console.log(req.method);
        
        if (req.method == "GET") {
            fetchSellersController(req, reply);
        } else if (req.method == "POST") {
            createSellerController(req, reply);
        } else if (req.method == "PUT") {
            if (!req.params.id) {
                return reply.code(400).send({ 
                    success: false, 
                    message: 'ID is required for update operation' 
                });
            }
            updateSellerController(req, reply);
        }
      },
    });
    done();
}