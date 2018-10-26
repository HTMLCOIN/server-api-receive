const logger = require('log4js').getLogger('${ROOT}/App/Components/Socket/Socket.js');
const config = require('../../../config/main.json');
const ZmqEvents = require('../../Components/Socket/ZmqEvents');
const zmq = require('zmq');
const bitcore = require('htmlcoin-lib');

class Socket {

    constructor(ZMQ_URL) {

        logger.info('Init');
        this.events = {};
        this.zmqSubSocket = null;
        this._initZmqSubSocket(ZMQ_URL);
        this.initSocketEvents();

    }

    _initZmqSubSocket(ZMQ_URL) {

        this.zmqSubSocket = zmq.socket('sub');

        this.zmqSubSocket.on('connect', (fd, endPoint) => {
            logger.info('[ZMQ] connected to:', endPoint);
        });

        this.zmqSubSocket.on('connect_delay', (fd, endPoint) => {
            logger.warn('[ZMQ] connection delay:', endPoint);
        });

        this.zmqSubSocket.on('disconnect', (fd, endPoint) => {
            logger.warn('[ZMQ] disconnect:', endPoint);
        });

        this.zmqSubSocket.on('monitor_error', (err) => {
            logger.error('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
            setTimeout(() => {
                this.zmqSubSocket.monitor(500, 0);
            }, 5000);
        });

        this.zmqSubSocket.monitor(500, 0);
        this.zmqSubSocket.connect(ZMQ_URL);

    }

    initSocketEvents() {
        this.events.zmqEvents = new ZmqEvents(this.zmqSubSocket);
    }

}

module.exports = Socket;
