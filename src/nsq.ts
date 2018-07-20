import { Writer, Reader } from 'nsqjs'

let nsqWriter

export let nsqReaderFactory = (topic, channel) => {
    return new Reader(topic, channel, {
      lookupdHTTPAddresses: process.env.NSQLOOKUP_HTTP_URL || 'localhost:4161'
    })
  }

export let getNsqWriter = () => {
  if(!nsqWriter) {
    let [nsqdHost, nsqdPort] = (process.env.NSQD_TCP_URL || 'localhost:4150').split(':')
    nsqWriter = new Writer(nsqdHost, parseInt(nsqdPort))
    nsqWriter.connect()
  }

  return nsqWriter
}

export let nsqPublish = (topic, msg) => {
  getNsqWriter().publish(topic, msg)
}