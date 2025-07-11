export function amount2Integer( amount: string ): number | undefined {
    let result: number = 0;
    const normalizedAmount = amount.replace(',', '.');
    const amountArray = normalizedAmount.split(".");
    if (amountArray.length === 2){
        if(amountArray[1].length === 2) {
            result = parseInt(amountArray[0]) * 100 + parseInt(amountArray[1]);
        } else if(amountArray[1].length === 1){
            result = parseInt(amountArray[0]) * 100 + parseInt(amountArray[1]) * 10;
        } else if(amountArray[1].length > 2){
            result = parseInt(amountArray[0]) * 100 + parseInt(amountArray[1].slice(0, 2));
        }
    } else if(amountArray.length === 1){
        result = parseInt(amountArray[0]) * 100;
    } else {
        return undefined;
    }

    return result;
}