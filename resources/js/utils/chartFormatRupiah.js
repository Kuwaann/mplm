export default function chartFormatRupiah(value){
    const absoluteValue = Math.abs(value);
    const isNegativeValue = value < 0;

    if(absoluteValue === 0){
        return "0";
    }

    else if(absoluteValue < 1000){
        return isNegativeValue ? `-Rp ${absoluteValue}` : `Rp ${absoluteValue}`;
    }

    else if(absoluteValue >= 1000 && absoluteValue < 1000000){
        const formattedValue = absoluteValue / 1000;
        return isNegativeValue ? `-Rp ${formattedValue}K` : `Rp ${formattedValue}K`;
    }

    else if(absoluteValue >= 1000000){
        const formattedValue = absoluteValue / 1000000;
        return isNegativeValue ? `-Rp ${formattedValue}M` : `Rp ${formattedValue}M`;
    }
}