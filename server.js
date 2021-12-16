const express = require('express')
const doAction = require('./switchActions')
const switches = require('./switches.json')
const { getFriendlyName } = require('./soapbuilder')
const app = express()

app.set('view engine', 'pug')

app.use(express.json())

app.get('/', async (req, res) => {
    res.render('conductor_home', {
        title: 'Wemo Conductor',
        endpoints: switches
    })
})

app.post('/api/wemo-action', async (req, res) => {
    const body = req.body

    if (typeof body.action === 'undefined') {
        // No action sent.
        return res.status(400).send({
            success: false,
            error: 'Action not provided.'
        });
    }

    const { httpStatus, body: httpBody } = await doAction(body)

    res.status(httpStatus).send(httpBody)

    // Action provided.
    // TODO: Move this out to a separate function.
    /*switch (body.action) {
        case "toggleSwitchesBulk":
            // Bulk switch toggle.
            if (typeof body.switches === 'undefined' || !Array.isArray(body.switches)) {
                // Either switches is undefined, or is not an array.
                return res.status(400).send({
                    success: false,
                    error: 'Switches was either not provided, or is not an array.'
                })
            }

            // Validate body with Joi
            try {
                await toggleSwitchesBulkSchema.validateAsync(body)

                let switchActions = []
                body.switches.forEach(switchEl => {
                    switchActions.push(toggleSwitch(switchEl.ip, switchEl.port))
                })

                const results = await Promise.allSettled(switchActions)
                return res.send({
                    success: true,
                    data: results
                })
            } catch (error) {
                return res.status(400).send({
                    success: false,
                    error: error.message
                })
            }
        default:
            return res.status(400).send({
                success: false,
                error: 'Action is not valid.'
            })
    }*/
})

switches.every(async el => {
    const name = await getFriendlyName(el[0], el[1])
    el.push(name)
})

app.listen(3030, () => {
    console.log('http://localhost:3030')
})