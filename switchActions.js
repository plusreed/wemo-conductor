const soapbuilder = require('./soapbuilder')
const {
    getStateSchema,
    getStatesBulkSchema,
    toggleSwitchesBulkSchema,
    toggleSwitchSchema
} = require('./joiSchemas')

async function doAction(body) {
    switch (body.action) {
        case "toggleSwitchesBulk":
            try {
                await toggleSwitchesBulkSchema.validateAsync(body)
            } catch (error) {
                return {
                    httpStatus: 400,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }

            const wemoActions = []

            body.switches.forEach(wemoSwitch => {
                wemoActions.push(soapbuilder.toggleSwitch(wemoSwitch.ip, wemoSwitch.port))
            })

            const results = await Promise.allSettled(wemoActions)

            console.log(results)

            return {
                httpStatus: 200,
                body: {
                    success: true,
                    data: results
                }
            }
        case "toggleSwitch":
            try {
                await toggleSwitchSchema.validateAsync(body)
            } catch (error) {
                return {
                    httpStatus: 400,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }

            try {
                await soapbuilder.toggleSwitch(body.switch.ip, body.switch.port)

                return {
                    httpStatus: 200,
                    body: {
                        success: true
                    }
                }
            } catch (error) {
                return {
                    httpStatus: 500,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }
        case "getStatesBulk":
            try {
                await getStatesBulkSchema.validateAsync(body)
            } catch (error) {
                return {
                    httpStatus: 400,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }

            const wemoStates = []

            body.switches.forEach(wemoSwitch => {
                wemoStates.push(soapbuilder.getBinaryState(wemoSwitch.ip, wemoSwitch.port))
            })

            const allStates = await Promise.allSettled(wemoStates)

            return {
                httpStatus: 200,
                body: {
                    success: true,
                    data: allStates
                }
            }
        case "getState":
            try {
                await getStateSchema.validateAsync(body)
            } catch (error) {
                return {
                    httpStatus: 400,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }

            try {
                const response = await soapbuilder.getBinaryState(body.switch.ip, body.switch.port)

                return {
                    httpStatus: 200,
                    body: {
                        success: true,
                        data: response
                    }
                }
            } catch (error) {
                return {
                    httpStatus: 500,
                    body: {
                        success: false,
                        error: error.message
                    }
                }
            }
        default:
            return {
                httpStatus: 400,
                body: {
                    success: false,
                    error: 'invalid action'
                }
            }
    }
}

module.exports = doAction