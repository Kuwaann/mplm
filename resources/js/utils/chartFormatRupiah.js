export default function chartFormatRupiah(value) {
    const absoluteValue = Math.abs(value);
    const isNegativeValue = value < 0;

    if (absoluteValue === 0) {
        return "0";
    }

    else if (absoluteValue < 1000) {
        return isNegativeValue ? `-$ ${absoluteValue}` : `$ ${absoluteValue}`;
    }

    else if (absoluteValue >= 1000 && absoluteValue < 1000000) {
        const formattedValue = absoluteValue / 1000;
        return isNegativeValue ? `-$ ${formattedValue}K` : `$ ${formattedValue}K`;
    }

    else if (absoluteValue >= 1000000) {
        const formattedValue = absoluteValue / 1000000;
        return isNegativeValue ? `-$ ${formattedValue}M` : `$ ${formattedValue}M`;
    }
}