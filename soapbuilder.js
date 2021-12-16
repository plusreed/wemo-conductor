const xmlbuilder = require('xmlbuilder')
const axios = require('axios').default
const xml2js = require('xml2js')

async function getBinaryState(host, port = 49152) {
    const _soapMessage = xmlbuilder.create('s:Envelope')
        .ele('s:Body')
        .ele('u:GetBinaryState', {'xmlns:u': 'urn:Belkin:service:basicevent:1'})
        .end({ pretty: true })

    const res = await axios.post(`http://${host}:${port}/upnp/control/basicevent1`, _soapMessage, {
        headers: {
            'Content-Type': 'text/xml; charset="utf-8"',
            'SOAPACTION': 'urn:Belkin:service:basicevent:1#GetBinaryState'
        }
    })

    const data = await xml2js.parseStringPromise(res.data)
    const state = parseInt(data['s:Envelope']['s:Body'][0]['u:GetBinaryStateResponse'][0].BinaryState[0])

    return {
        state: state === 1,
        ip: host,
        port
    };
}

async function setBinaryState(host, port = 49152, isOn = true) {
    const _soapMessage = xmlbuilder.create('s:Envelope')
        .ele('s:Body')
        .ele('u:SetBinaryState', {'xmlns:u': 'urn:Belkin:service:basicevent:1'})
        .ele('BinaryState', isOn ? 1 : 0)
        .end({ pretty: true })

    await axios.post(`http://${host}:${port}/upnp/control/basicevent1`, _soapMessage, {
        headers: {
            'Content-Type': 'text/xml; charset="utf-8"',
            'SOAPACTION': 'urn:Belkin:service:basicevent:1#SetBinaryState'
        }
    })

    return true
}

async function toggleSwitch(host, port) {
    const isOn = await getBinaryState(host, port)

    if (isOn.state) {
        // Turn off the switch
        await setBinaryState(host, port, false)
    } else {
        // Turn the switch on
        await setBinaryState(host, port, true)
    }
}

async function getFriendlyName(host, port) {
    const { data } = await axios.get(`http://${host}:${port}/setup.xml`)
    const xml = await xml2js.parseStringPromise(data)

    return xml.root.device[0].friendlyName[0]
}

module.exports = {
    getBinaryState,
    getFriendlyName,
    setBinaryState,
    toggleSwitch
}