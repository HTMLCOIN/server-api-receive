const RPC = require('htmlcoind-rpc');
const config = require('../../config/main.json');

class RpcRepository {

    constructor(configRPC) {
        this.client = new RPC({
            protocol: configRPC.PROTOCOL || 'http',
            host: configRPC.HOST || '127.0.0.1',
            port: configRPC.PORT,
            user: configRPC.USER,
            pass: configRPC.PASSWORD,
            rejectUnauthorized: true
        });
    }

    getClient() {
        return this.client;
    }

    getNewAddress(callback) {

        return this.getClient().getNewAddress((err, response) => {

            if (err) {
                return callback(err);
            }

            callback(null, {
                address: response.result
            });
        });
    };

    getnetworknfo(callback) {

        return this.getClient().getnetworkinfo((err, response) => {

            if (err) {
                return callback(err);
            }

            return callback(null, response.result);
        });
    }

    getAddressBalance(addresses, callback) {

        return this.getClient().getAddressBalance({addresses: addresses}, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    getAddressUtxos(addresses, callback) {

        return this.getClient().getAddressUtxos({addresses: addresses}, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    createRawTransaction(outputs, addresses, callback) {

        return this.getClient().createRawTransaction(outputs, addresses, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    signRawTransaction(hex, callback) {

        return this.getClient().signRawTransaction(hex, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    sendRawTransaction(hex, callback) {

        return this.getClient().sendRawTransaction(hex, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    getRawTransaction(hex, callback) {

        return this.getClient().getRawTransaction(hex, 1, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    getBlock(hex, callback) {

        return this.getClient().getBlock(hex, (err, response) => {

            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

    getBlockHash(height, callback) {
        return this.getClient().getBlockHash(height, (err, response) => {
            if (err) {
                return callback(err);
            }

            return callback(null, response.result);

        });

    }

}

module.exports = new RpcRepository(config.RPC);
