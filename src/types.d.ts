declare module 'sort-by' {
    /**
     * Создает функцию сравнения для сортировки объектов
     * @param properties Свойства для сортировки (можно с префиксом "-" для обратного порядка)
     * @param map Функция преобразования значений (опционально)
     */
    function sortBy<T = any>(
        ...args: Array<string | ((key: string, value: any) => any)>
    ): (a: T, b: T) => number;

    export = sortBy;
}