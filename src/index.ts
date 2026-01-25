// test.ts
import sortBy from 'sort-by';

interface User {
    name: string;
    age: number;
    email: string;
}

const users: User[] = [
    { name: 'Alice', age: 30, email: 'alice@example.com' },
    { name: 'Bob', age: 25, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' }
];

// Тест 1: Сортировка по одному полю
const sortedByName = users.sort(sortBy('name'));
console.log('По имени:', sortedByName.map(u => u.name));

// Тест 2: Сортировка по убыванию
const sortedByAgeDesc = users.sort(sortBy('-age'));
console.log('По возрасту (убыв.):', sortedByAgeDesc.map(u => u.age));

// Тест 3: Сортировка по нескольким полям
const usersWithSameAge = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 30 }
];
const sortedByMultiple = usersWithSameAge.sort(sortBy('age', 'name'));
console.log('По возрасту и имени:', sortedByMultiple.map(u => u.name));

// Тест 4: Сортировка с функцией преобразования
const usersMixedCase = [
    { name: 'alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'CHARLIE', age: 35 }
];
const sortedCaseInsensitive = usersMixedCase.sort(
    sortBy('name', (key, value) => value.toLowerCase())
);
console.log('Без учета регистра:', sortedCaseInsensitive.map(u => u.name));

// Тест 5: Проверка типов
const comparator = sortBy('age');
const result = comparator(users[0], users[1]); // number
console.log('Результат сравнения:', result);