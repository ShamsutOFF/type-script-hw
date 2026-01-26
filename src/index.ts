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
            const response = await fetch(this.url, {
                method: this.method,
                headers: {...this.headers},
                body: this.body
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('result is: ', JSON.stringify(result, null, 4));

            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
}