import debugLogger from 'debug';
import { changellyMethods, requireExtraId } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils, post } from '../helpers';

const errorLogger = debugLogger('v5-error:changelly-api');

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.changelly;
}

function checkAndChange(value) {
  if (value === 'USDT') {
    return 'usdt';
  }
  if (value === 'USDT Omni') {
    return 'usdt20';
  }
  return value;
}

export default class ChangellyCalls {
  constructor(errorHandler) {
    this.handleOrThrow = utils.handleOrThrow(errorHandler);
  }

  async getSupportedCurrencies(network) {
    try {
      const currencyList = await this.getCurrencies(network);
      const currencyDetails = {};
      const tokenDetails = {};
      if (currencyList) {
        for (let i = 0; i < currencyList.length; i++) {
          if (
            !requireExtraId.includes(currencyList[i].name.toUpperCase()) &&
            currencyList[i].enabled
          ) {
            if (
              currencyList[i].extraIdName === null ||
              currencyList[i].extraIdName === undefined
            ) {
              const details = {
                symbol: currencyList[i].name.toUpperCase(),
                name: currencyList[i].fullName,
                fixRateEnabled: currencyList[i].fixRateEnabled
              };
              if (currencyList[i].name === 'usdt') {
                currencyList[i].name = 'usdt Omni';
                details.symbol = 'USDT Omni';
                details.name = 'Tether USD on Omni Link';
              }
              if (currencyList[i].name === 'usdt20') {
                details.symbol = 'USDT';
                details.name = 'Tether USD';
              }
              currencyDetails[details.symbol] = details;
              tokenDetails[details.symbol] = details;
            }
          }
        }
        return { currencyDetails, tokenDetails };
      }
      throw Error(
        'Changelly get supported currencies failed to return a value'
      );
    } catch (e) {
      this.handleOrThrow(e);
      errorLogger(e);
    }
  }

  async getCurrencies(network) {
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].currenciesFull, {})
        );

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      return Promise.resolve({});
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async getRate(fromCurrency, toCurrency, fromValue, network) {
    console.log('getRate(fromCurrency, toCurrency, fromValue, network)', fromCurrency, toCurrency, fromValue, network); // todo remove dev item

    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].rate, [
            {
              from: checkAndChange(fromCurrency),
              to: checkAndChange(toCurrency),
              amount: fromValue
            }
          ])
        );
        console.log(results); // todo remove dev item
        if (results.error) {
          throw Error(results.error.message);
        }
        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async getResultAmount(fromCurrency, toCurrency, fromValue, network) {
    console.log('getResultAmount(fromCurrency, toCurrency, fromValue, network)', fromCurrency, toCurrency, fromValue, network); // todo remove dev item
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].rate, {
            from: checkAndChange(fromCurrency),
            to: checkAndChange(toCurrency),
            amount: fromValue
          })
        );
        console.log(results); // todo remove dev item

        if (results.error) {
          throw Error(results.error.message);
        }
        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async getMin(fromCurrency, toCurrency, fromValue, network) {
    console.log('getMin(fromCurrency, toCurrency, fromValue, network)', fromCurrency, toCurrency, fromValue, network); // todo remove dev item
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].min, {
            from: checkAndChange(fromCurrency),
            to: checkAndChange(toCurrency)
          })
        );
        console.log(results); // todo remove dev item

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async validateAddress(addressDetails, network) {
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].validate, addressDetails)
        );

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async createTransaction(transactionParams, network) {
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(
            changellyMethods[network].createTransaction,
            transactionParams
          )
        );
        console.log(results); // todo remove dev item

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async getStatus(orderId, network) {
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].status, {
            id: orderId
          })
        );

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      throw Error(`Changelly does not support ${network} network`);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  login() {
    return Promise.resolve({});
  }

  async getFixRate(fromCurrency, toCurrency, fromValue, network) {
    console.log('getFixRate(fromCurrency, toCurrency, fromValue, network)', fromCurrency, toCurrency, fromValue, network); // todo remove dev item
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(changellyMethods[network].getFixRate, [
            {
              from: checkAndChange(fromCurrency),
              to: checkAndChange(toCurrency)
            }
          ])
        );
        console.log(results); // todo remove dev item

        if (results.error) {
          throw Error(results.error.message);
        }
        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async createFixTransaction(transactionParams, network) {
    try {
      if (changellyMethods[network]) {
        const results = await post(
          buildPath(),
          utils.buildPayload(
            changellyMethods[network].createFixTransaction,
            transactionParams
          )
        );
        console.log(results); // todo remove dev item

        if (results.error) {
          throw Error(results.error.message);
        }

        return results.result;
      }
      return Promise.resolve(-1);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }
}

//
// export default {
//   getCurrencies,
//   getRate,
//   getResultAmount,
//   getMin,
//   validateAddress,
//   createTransaction,
//   getStatus,
//   login,
//   getFixRate,
//   createFixTransaction
// };
