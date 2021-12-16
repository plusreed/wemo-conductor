const Joi = require('joi')

const getStateSchema = Joi.object({
    action: Joi.string().valid('getState'),
    switch: Joi.object({
        ip: Joi.string().ip().required(),
        port: Joi.string().required()
    }).required()
})

const toggleSwitchSchema = Joi.object({
    action: Joi.string().valid('toggleSwitch').required(),
    switch: Joi.object({
        ip: Joi.string().ip().required(),
        port: Joi.string().required()
    }).required()
})

const getStatesBulkSchema = Joi.object({
    action: Joi.string().valid('getStatesBulk').required(),
    switches: Joi.array().items(
        Joi.object({
            ip: Joi.string().ip().required(),
            port: Joi.string().required()
        }).required()
    ).required()
})

const toggleSwitchesBulkSchema = Joi.object({
    action: Joi.string().valid('toggleSwitchesBulk').required(),
    switches: Joi.array().items(
        Joi.object({
            ip: Joi.string().ip().required(),
            port: Joi.string().required()
        }).required()
    ).required()
})

module.exports = {
    getStateSchema,
    getStatesBulkSchema,
    toggleSwitchSchema,
    toggleSwitchesBulkSchema
}