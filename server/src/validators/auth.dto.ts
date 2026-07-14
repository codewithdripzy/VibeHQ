import Joi from "joi";

const loginDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const registerDto = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const socialAuthDto = Joi.object({
    code: Joi.string().optional(),
    accessToken: Joi.string().optional(),
    idToken: Joi.string().optional(),
    redirectUri: Joi.string().uri().optional(),
}).or("code", "accessToken", "idToken");

const verifyOauthTokenDto = Joi.object({
    token: Joi.string().required(),
});

export { loginDto, registerDto, socialAuthDto, verifyOauthTokenDto };
