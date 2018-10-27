const bitcore = require('htmlcoin-lib');
const Transaction = bitcore.Transaction;
const config = require('../../config/main.json');

class TransactionTransformService {

    static transformFromMessage(message) {
        let transaction = new Transaction().fromBuffer(message),
            valueOut = 0,
            vout = [];

        for (let i = 0; i < transaction.outputs.length; i++) {
            let output = transaction.outputs[i];
            valueOut += output.satoshis;
            if (output.script) {
                let address = output.script.toAddress(config.NETWORK);
                if (address) {
                    let obj = {};
                    obj[address.toString()] = output.satoshis;
                    vout.push(obj);
                }
            }
        }


        return {
            txid: transaction.hash,
            valueOut: valueOut / 1e8,
            vout: vout
        };

    }

}

module.exports = TransactionTransformService;
