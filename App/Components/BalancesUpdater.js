const logger = require('log4js').getLogger('${ROOT}/App/Components/BalancesUpdater.js');
const BalanceReceiveService = require('../Services/BalanceReceiveService');
const BalanceTransferService = require('../Services/BalanceTransferService');
const BalanceUpdaterRepository = require('../Repositories/BalanceUpdaterRepository');
const async = require('async');
const config = require('../../config/main.json');
const events = require('events');
const RangeHelper = require('../Helpers/RangeHelper');
const rpcRepositoryInstance = require('../Repositories/RpcRepository');


class BalancesUpdater {

    constructor(rpcRepository) {
        logger.info('Init');

        this.rpcRepository = rpcRepository;
        this.currentBlockNum = 0;
        this.inProcess = false;

    }

    start(next) {

        logger.info('Start...');

        return BalanceUpdaterRepository.setBalanceUpdaterType((err) => {
            this.checkBalances((err) => {

            });
            return next(err);
        });

    }

    checkBalances(next) {

        if (this.inProcess) {
            return next();
        }

        this.inProcess = true;

        let lastCheckedBlock;

        async.waterfall([(callback) => {
            return this.setCurrentBlock((err) => {
                return callback(err);
            });
        }, (callback) => {
            return BalanceUpdaterRepository.getLastCheckedBlock((err, block) => {
                lastCheckedBlock = block;
                return callback(err);
            });
        }, (callback) => {

            let currentBlock = this.currentBlockNum;

            if (currentBlock > lastCheckedBlock) {

                return async.eachSeries(RangeHelper.getRangeArrayNumbers(lastCheckedBlock + 1, currentBlock), (blockId, callback) => {

                    lastCheckedBlock = blockId;

                    logger.info('Checking:', blockId);

                    return BalanceReceiveService.updateBlockById(blockId, (err) => {
                        if (err) {
                            logger.error('Update block error:', err);
                            return callback(err);
                        }

                        logger.info('Checked:', blockId);

                        return callback();


                    });

                }, (err) => {
                    return callback(err);
                });

            } else {
                return callback();
            }

        }], (err) => {

            this.inProcess = false;

            if (err) {
                logger.error('CheckBalances error', err);
                return next(err);
            }

            if (lastCheckedBlock < this.currentBlockNum) {
                return this.checkBalances(next);
            } else {
                return next(err);
            }

        });

    }

    setCurrentBlock(next) {
        return this.rpcRepository.getblockchaininfo((err, block) => {

            if (err) {
                return next(err);
            }

            this.currentBlockNum = block.blocks;

            logger.info('Current block:', this.currentBlockNum);

            return next(err, block);

        });
    }

}

module.exports = new BalancesUpdater(rpcRepositoryInstance);
