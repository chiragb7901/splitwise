const exchangeRates = require("./exchangeRates");

function currencyConversion(fromCurrency, toCurrency, amountToBeConverted) {
  let convertedAmount = amountToBeConverted;
  if (fromCurrency != toCurrency) {
    if (
      !exchangeRates[fromCurrency] ||
      !exchangeRates[fromCurrency][toCurrency]
    ) {
      throw new Error(
        `Conversion rate from ${fromCurrency} to ${toCurrency} is not available.`
      );
    }

    const exchangeRate = exchangeRates[fromCurrency][toCurrency];
    convertedAmount = convertedAmount * exchangeRate;
  }
  return convertedAmount;
}

export default currencyConversion;