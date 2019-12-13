/**
 * MQTT 配置
 */

'use strict'

const mqtt = require('mqtt')
const chalk = require('chalk')
const port = process.env.MQTT_PORT
const host = process.env.MQTT_HOST
const clientId = process.env.MQTT_CLIENTID
const Data = require('../api/data/data.model')
const Device = require('../api/device/device.model')

// MQTT client
const client = mqtt.connect({
  port: port,
  protocol: 'mqtts',
  host: host,
  clientId: clientId,
  reconnectPeriod: 1000,
  username: clientId,
  password: clientId,
  keepalive: 300,
  rejectUnauthorized: false
})

// 建立连接
client.on('connect', () => {
  console.log(chalk.black.bgWhite(clientId + ' connected to ' + host + ' on port ' + port))

  // 订阅设备的反馈
  client.subscribe('api/feedback')

  client.subscribe('api/pi/dht11/data')
  client.subscribe('api/pi/camera/data')
})

// 发送消息
client.on('message', async (topic, message) => {
  // message is Buffer

  switch (topic) {
    // 反馈
    case 'api/feedback':
      const mac = message.toString()
      console.log('Device Response >> ', mac)

      // 发布API的反馈
      client.publish(`device/feedback/${mac}`, mac)
      break;

    case 'api/pi/dht11/data': {
      const data = JSON.parse(message.toString())
      const device = await Device.findOne({ macAddress: data.macAddress })
      const result = new Data({ ...data, createdBy: device._id })
      await result.save()
      console.log('DHT11_Data Saved')
    } break;

    case 'api/pi/camera/data': {
      const data = JSON.parse(message.toString())
      const device = await Device.findOne({ macAddress: data.macAddress })
      const result = new Data({ ...data, createdBy: device._id })
      await result.save()
      console.log('Camera_Data Saved')
    } break;

    default:
      break;
  }
})

exports.onDHT11 = (data) => {
  if (data.status === true) {
    client.publish(`device/pi/dht11/${data.macAddress}/start`)
  } else
    if (data.status === false) {
      client.publish(`device/pi/dht11/${data.macAddress}/stop`)
    }
}

exports.onLED = (data) => {
  if (data.status === true) {
    client.publish(`device/pi/led/${data.macAddress}/start`)
  } else
    if (data.status === false) {
      client.publish(`device/pi/led/${data.macAddress}/stop`)
    }
}

exports.onCamera = (data) => {
  if (data.status === true) {
    client.publish(`device/pi/camera/${data.macAddress}/start`)
  } else
    if (data.status === false) {
      client.publish(`device/pi/camera/${data.macAddress}/stop`)
    }
}