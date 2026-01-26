interface IA {
    a: number;
    b: string;
}

interface IB {
    a: number;
    c: boolean;
}

let a: IA = { a: 5, b: '123' };
let b: IB = { a: 10, c: true };

interface IDifference {
    b: string;
}

let v0: IDifference = difference(a, b);

function difference<T extends object, U extends object>(a: T, b: U): Omit<T, keyof U> {
    return Object.fromEntries(
        Object.entries(a).filter(([key]) => !(key in b))
    ) as Omit<T, keyof U>;
}

console.log(v0);