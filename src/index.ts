/*
Написать декоратор, который при присвоении проверяет присваиваемое значение функцией.
Если она возвращает true – присваивание происходит, если false – то нет.
 */

class User {
    @allowFunc<number>((a: number) => a > 0)
    age: number = 30;
}

const person = new User();
console.log(person.age); // 30

person.age = 0;
console.log(person.age); // 30

person.age = 20;
console.log(person.age); // 20

function allowFunc<T>(validator: (value: T) => boolean) {
    return function(target: any, propertyKey: string) {
        let value: T = target[propertyKey];

        const getter = () => value;
        const setter = (newValue: T) => {
            if (validator(newValue)) {
                value = newValue;
            }
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}