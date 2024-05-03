import {Response, NextFunction} from 'express';
import {NewRequest} from "../types/request.types";
import Order from "../models/order.model";
import Joi from 'joi';
import {Request} from 'express';

const commentValidationSchema = Joi.object({
    _id: Joi.string().optional(),
    managerId: Joi.string().optional(),
    managerName: Joi.string().optional(),
    comment: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date())
});

const orderUpdateValidationSchema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().allow('', null).optional(),
    surname: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    age: Joi.number().allow(null).optional(),
    course: Joi.string().valid('QACX', 'PCX', 'JSCX', 'JCX', 'FS', 'FE').allow('', null).optional(),
    course_format: Joi.string().allow('', null).optional(),
    course_type: Joi.string().valid('vip', 'pro', 'minimal', 'premium', 'incubator').allow('', null).optional(),
    sum: Joi.number().allow(null).optional(),
    already_paid: Joi.boolean().allow(null, '').optional(),
    created_at: Joi.date().optional(),
    utm: Joi.string().allow('', null).optional(),
    msg: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('pending', 'completed', 'cancelled', 'in work', 'dubbing', 'new').allow('', null).optional(),
    group: Joi.string().allow('', null).optional(),
    manager: Joi.string().allow('', null).optional(),
    comments: Joi.array().items(commentValidationSchema).optional()
}).or('name', 'surname', 'email', 'phone', 'age', 'course', 'course_format', 'course_type', 'sum', 'already_paid', 'created_at', 'utm', 'msg', 'status', 'group', 'manager', 'comments');

function validateOrderInput(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {

        const validationResult = schema.validate(req.body, {abortEarly: false});
        const {error} = validationResult;

        if (error) {
            console.log("Validation error:", error);
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            console.log("Validation error message:", errorMessage);
            return res.status(400).send(errorMessage);
        }

        console.log("Validation passed.");
        next();
    };
}

export const validateOrderUpdate = validateOrderInput(orderUpdateValidationSchema);

export const checkUserIsManagerOfOrder = async (req: NewRequest, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    const userId = req.user?._id;
    console.log("OrderId:", orderId, "UserId:", userId);
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (order.manager === userId ) {
            req.order = order;
            next();
        } else {
            return res.status(403).send('Permission denied. You are not the manager of this order.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};


export const canAddCommentToOrder = async (req: NewRequest, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const userId = req.user?._id;
    console.log("OrderId:", orderId, "UserId:", userId);

    try {
        const order = await Order.findById(orderId);

        console.log("Found order:", order);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (!order.manager || order.manager === "" || order.manager === userId ) {
            req.order = order;
            next();
        } else {
            return res.status(403).send('Permission denied. You are not authorized to add a comment to this order.');
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).send(error.message);
    }
};

