/*
Написать класс генератора запроса, который будет использовать паттерн билдера с функциями добавления:

Тип запроса: GET, POST…
Body
Заголовки
Url
И финальной функции exec, который делает fetch запрос.
 */

enum IRequestType {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    delete = 'DELETE'
}

class RequestBuilder {
    private method: IRequestType = IRequestType.get;
    private url: string = '';
    private body: string = '';
    private headers: [string, string][] = [];

    setMethod(method: IRequestType) {
        this.method = method;
        return this;
    }

    setBody(body: string) {
        this.body = body;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setHeader(key: string, value: string) {
        this.headers.push([key, value]);
        return this;
    }

    async exec() {
        if (!this.url) {
            throw new Error('Url is required');
        }

        try {
            // Преобразуем массив заголовков в объект
            const headersObj: Record<string, string> = {};
            this.headers.forEach(([key, value]) => {
                headersObj[key] = value;
            });

            const response = await fetch(this.url, {
                method: this.method,
                headers: headersObj,
                body: this.method === IRequestType.get ? undefined : this.body // Не передаем body для GET
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('result is: ', JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                throw error;
            } else {
                console.log('unexpected error: ', error);
                throw new Error('An unexpected error occurred');
            }
        }
    }
}

class ProductAPI {
    public baseUrl: string = 'https://dummyjson.com/products';

    getProduct(id: number): Promise<any> {
        // Базовая реализация (будет перехвачена Proxy)
        return new RequestBuilder()
            .setMethod(IRequestType.get)
            .setUrl(`${this.baseUrl}/${id}`)
            .exec();
    }
}

// Создаем Proxy
const apiWithProxy = new Proxy(new ProductAPI(), {
    get(target, prop, receiver) {
        if (prop === 'getProduct') {
            return function(id: number) {
                if (id < 10) {
                    return Reflect.get(target, prop, receiver).call(target, id);
                } else {
                    return Promise.reject(new Error(`ID ${id} must be less than 10`));
                }
            };
        }
        return Reflect.get(target, prop, receiver);
    }
});

// Тестируем
async function test() {
    try {
        // ID < 10 - работает
        console.log('Запрос ID 1:');
        const product1 = await apiWithProxy.getProduct(1);
        console.log('Успех:', product1.title);

        console.log('\nЗапрос ID 5:');
        const product5 = await apiWithProxy.getProduct(5);
        console.log('Успех:', product5.title);

        // ID >= 10 - ошибка
        console.log('\nЗапрос ID 10:');
        await apiWithProxy.getProduct(10);
    } catch (error) {
        console.log('Ошибка:', (error as Error).message);
    }

    try {
        console.log('\nЗапрос ID 15:');
        await apiWithProxy.getProduct(15);
    } catch (error) {
        console.log('Ошибка:', (error as Error).message);
    }
}

// Запускаем тест
test();