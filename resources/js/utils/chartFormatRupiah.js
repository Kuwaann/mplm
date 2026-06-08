export default function chartFormatRupiah(value) {
    const absoluteValue = Math.abs(value);
    const isNegativeValue = value < 0;

    if (absoluteValue === 0) {
        return "0";
    }

    else if (absoluteValue < 1000) {
        const formattedValue = absoluteValue.toFixed(2);
        return isNegativeValue ? `-$ ${formattedValue}` : `$ ${formattedValue}`;
    }

    else if (absoluteValue >= 1000 && absoluteValue < 1000000) {
        const formattedValue = absoluteValue.toLocaleString('en-US');
        return isNegativeValue ? `-$ ${formattedValue}M` : `$ ${formattedValue}M`;
    }

    else if (absoluteValue >= 1000000) {
        const formattedValue = (absoluteValue / 1000000).toFixed(2);
        return isNegativeValue ? `-$ ${formattedValue}M` : `$ ${formattedValue}M`;
    }
}