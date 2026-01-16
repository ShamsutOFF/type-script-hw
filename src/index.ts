/*
Напишите функцию, которая отправляет запрос на <u>https://dummyjson.com/users</u>

для получения пользователей и вывода части их данных их в консоль. Так же нужно:

Обработать ошибку исключения
Использовать enum
 */

enum HttpError {
    NOT_FOUND = 'Not Found',
    BAD_REQUEST = 'Bad Request',
    FORBIDDEN = 'Forbidden',
    UNAUTHORIZED = 'Unauthorized',
    INTERNAL_SERVER_ERROR = 'Internal Server Error'
}

// Шаг 1: Определим тип пользователя
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: Hair;
    ip: string;
    address: Address;
    macAddress: string;
    university: string;
    bank: Bank;
    company: Company;
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: Crypto;
    role: string;
}

export interface Crypto {
    coin: string;
    wallet: string;
    network: string;
}

export interface Company {
    department: string;
    name: string;
    title: string;
    address: Address;
}

export interface Bank {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
}

export interface Address {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: Coordinates;
    country: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Hair {
    color: string;
    type: string;
}

// Шаг 2: Функция ДОЛЖНА возвращать Promise
async function getUsers(): Promise<User[]> {
    try {
        // Шаг 3: Ждем ответ
        const response = await fetch('https://dummyjson.com/users');

        // Шаг 4: Проверяем статус
        if (!response.ok) {
            throw new Error(getErrorByStatus(response.status));
        }

        // Шаг 5: Парсим JSON
        const data = await response.json();

        // Шаг 6: Возвращаем пользователей
        return data.users as User[];

    } catch (error) {
        // Шаг 7: Обрабатываем ошибку
        console.error('Ошибка при получении пользователей:', error);
        throw error; // или возвращаем пустой массив
    }
}

// Функция для преобразования HTTP статуса в наше сообщение
function getErrorByStatus(status: number): HttpError {
    switch (status) {
        case 400: return HttpError.BAD_REQUEST;
        case 401: return HttpError.UNAUTHORIZED;
        case 403: return HttpError.FORBIDDEN;
        case 404: return HttpError.NOT_FOUND;
        case 500: return HttpError.INTERNAL_SERVER_ERROR;
        default: return `HTTP Error ${status}` as HttpError;
    }
}

async function main() {
    console.log('Начинаем загрузку пользователей...\n');

    try {
        const users = await getUsers();

        console.log(`✅ Успешно загружено ${users.length} пользователей:\n`);

        // Выводим только часть данных (первые 5 пользователей)
        users.slice(0, 5).forEach((user, index) => {
            console.log(user);
        });

    } catch (error) {
        if (error instanceof Error) {
            console.log(`❌ Ошибка: ${error.message}`);
        } else {
            console.log('❌ Неизвестная ошибка');
        }
    }
}

// Запускаем
main();