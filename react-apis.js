const express = require('express')
const router = express.Router()
const soapbuilder = require('./soapbuilder')
const switches = require('./switches.json')

router.get('/getAllWemos', async (req, res) => {
    const transformedSwitches = []

    switches.forEach(el => {
        transformedSwitches.push({
            ip: el[0],
            port: el[1],
            name: el[2]
        })
    })

    await res.send({
        success: true,
        data: transformedSwitches
    })
})

router.get('/getState', async (req, res) => {
    const ip = req.query.ip
    const port = parseInt(req.query.port)

    try {
        const state = await soapbuilder.getBinaryState(ip, port)

        res.send({
            success: true,
            data: state.state
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        })
    }
})

router.patch('/setState', async (req, res) => {
    const { ip, port, state } = req.body;

    if (typeof ip === 'undefined' || typeof port === 'undefined' || typeof state === 'undefined') {
        res.status(400).send({
            success: false,
            error: 'IP, port, or state was not provided.'
        })
    } else {
        try {
            await soapbuilder.setBinaryState(ip, parseInt(port), state)
            res.send({
                success: true
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                error: error.message
            })
        }
    }
})

module.exports = router