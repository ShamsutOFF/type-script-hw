const user = {
    name: "Vasiliy",
    age: 8,
    skills: ['typescript', 'javascript']
}

const res = pickObjectKeys(user, ['age', 'skills']);

/*
Написать функцию получения нужных данных из объектов котора вернет такой объект.
Функция должна принимать 2 аргумента: объект и массив ключей.
Функция должна проверять что ключи существуют в объекте и возвращать новый объект с этими ключами.
Используем дженерики и типизацию
{
  age: 8,
  skills: ['typescript', 'javascript']
}
*/

function pickObjectKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return keys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as Pick<T, K>);
}

console.log(res);