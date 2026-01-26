function swapKeysAndValues(obj: Record<string, string | number>): Record<string | number, string> {
    const result: any = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        result[value] = key;
    });

    return result;
}

const homeworkExample = {
    a: 1,
    b: 2
};

const result = swapKeysAndValues(homeworkExample);
console.log(result);