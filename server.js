const express = require('express')
const doAction = require('./switchActions')
const switches = require('./switches.json')
const { getFriendlyName } = require('./soapbuilder')
const { normalize, join } = require('path')
const cors = require('cors')
const app = express()

const frontBuild = normalize(join(__dirname, './frontend'))

app.use(express.json())
app.use(express.static(frontBuild))
app.use(cors())

app.use('/api/v1', require('./react-apis'))

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
})

app.get('(/*)?', async (req, res) => {
    res.sendFile(join(frontBuild, 'index.html'))
})

switches.every(async el => {
    const name = await getFriendlyName(el[0], el[1])
    el.push(name)
})

app.listen(3030, () => {
    console.log('http://localhost:3030')
})