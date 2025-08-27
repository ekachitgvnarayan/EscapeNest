import Joi from "joi";

const ListingSchema = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    // image:Joi.string().empty('').default('https://himkhoj.com/wp-content/uploads/2020/08/d_h-780x270.png'),
    price:Joi.number().min(0).required(),
    location:Joi.string().required(),
    country:Joi.string().required()
});

export {ListingSchema};