// Тип для узла связного списка (для разрешения коллизий)
type BucketNode<K, V> = {
    key: K;
    value: V;
    next?: BucketNode<K, V>;
};

class HashMap<K, V> {
    // Основное хранилище - массив бакетов (связных списков)
    private buckets: Array<BucketNode<K, V> | undefined>;
    private size: number = 0;
    private readonly initialCapacity: number = 16;
    private readonly loadFactor: number = 0.75;

    constructor(initialCapacity?: number) {
        this.buckets = new Array(initialCapacity || this.initialCapacity);
    }

    /**
     * Хэш-функция для вычисления индекса бакета
     * Использует встроенный механизм хэширования, если доступен
     */
    private hash(key: K): number {
        if (typeof key === 'string') {
            // Для строк - простая хэш-функция
            let hash = 0;
            for (let i = 0; i < key.length; i++) {
                hash = ((hash << 5) - hash) + key.charCodeAt(i);
                hash = hash & hash; // Преобразование в 32-битное целое
            }
            return Math.abs(hash) % this.buckets.length;
        } else if (typeof key === 'number') {
            // Для чисел - просто берем остаток от деления
            return Math.abs(key) % this.buckets.length;
        } else if (typeof key === 'object' && key !== null) {
            // Для объектов - используем toString()
            const str = JSON.stringify(key);
            return this.hash(str as any);
        }
        // Для других типов
        return Math.abs(String(key).length) % this.buckets.length;
    }

    /**
     * Перехеширование при превышении loadFactor
     */
    private rehash(): void {
        const oldBuckets = this.buckets;
        this.buckets = new Array(oldBuckets.length * 2);
        this.size = 0;

        for (const bucket of oldBuckets) {
            let currentNode = bucket;
            while (currentNode) {
                this.set(currentNode.key, currentNode.value);
                currentNode = currentNode.next;
            }
        }
    }

    /**
     * Добавление или обновление элемента
     */
    set(key: K, value: V): void {
        // Проверяем необходимость перехеширования
        if (this.size / this.buckets.length > this.loadFactor) {
            this.rehash();
        }

        const index = this.hash(key);
        let currentNode = this.buckets[index];

        // Если бакет пустой, создаем новый узел
        if (!currentNode) {
            this.buckets[index] = { key, value };
            this.size++;
            return;
        }

        // Ищем ключ в связном списке
        while (currentNode) {
            // Если ключ найден, обновляем значение
            if (this.isEqual(currentNode.key, key)) {
                currentNode.value = value;
                return;
            }
            // Если это последний узел, добавляем новый
            if (!currentNode.next) {
                currentNode.next = { key, value };
                this.size++;
                return;
            }
            currentNode = currentNode.next;
        }
    }

    /**
     * Получение значения по ключу
     */
    get(key: K): V | undefined {
        const index = this.hash(key);
        let currentNode = this.buckets[index];

        while (currentNode) {
            if (this.isEqual(currentNode.key, key)) {
                return currentNode.value;
            }
            currentNode = currentNode.next;
        }

        return undefined;
    }

    /**
     * Удаление элемента по ключу
     */
    delete(key: K): boolean {
        const index = this.hash(key);
        let currentNode = this.buckets[index];
        let previousNode: BucketNode<K, V> | undefined = undefined;

        while (currentNode) {
            if (this.isEqual(currentNode.key, key)) {
                // Если это первый элемент в бакете
                if (!previousNode) {
                    this.buckets[index] = currentNode.next;
                } else {
                    previousNode.next = currentNode.next;
                }
                this.size--;
                return true;
            }
            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        return false;
    }

    /**
     * Очистка всей мапы
     */
    clear(): void {
        this.buckets = new Array(this.initialCapacity);
        this.size = 0;
    }

    /**
     * Проверка на наличие ключа
     */
    has(key: K): boolean {
        return this.get(key) !== undefined;
    }

    /**
     * Возвращает количество элементов
     */
    getSize(): number {
        return this.size;
    }

    /**
     * Вспомогательный метод для сравнения ключей
     */
    private isEqual(a: K, b: K): boolean {
        if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        return a === b;
    }

    /**
     * Получение всех ключей
     */
    keys(): K[] {
        const keys: K[] = [];
        for (const bucket of this.buckets) {
            let currentNode = bucket;
            while (currentNode) {
                keys.push(currentNode.key);
                currentNode = currentNode.next;
            }
        }
        return keys;
    }

    /**
     * Получение всех значений
     */
    values(): V[] {
        const values: V[] = [];
        for (const bucket of this.buckets) {
            let currentNode = bucket;
            while (currentNode) {
                values.push(currentNode.value);
                currentNode = currentNode.next;
            }
        }
        return values;
    }

    /**
     * Получение всех пар [ключ, значение]
     */
    entries(): [K, V][] {
        const entries: [K, V][] = [];
        for (const bucket of this.buckets) {
            let currentNode = bucket;
            while (currentNode) {
                entries.push([currentNode.key, currentNode.value]);
                currentNode = currentNode.next;
            }
        }
        return entries;
    }
}

// Пример использования
function demonstrateHashMap() {
    const map = new HashMap<string, number>();

    // Добавление элементов
    map.set('apple', 5);
    map.set('banana', 10);
    map.set('orange', 7);
    map.set('grape', 3);

    console.log('Размер мапы:', map.getSize()); // 4
    console.log('Значение для "apple":', map.get('apple')); // 5
    console.log('Есть ли "banana"?', map.has('banana')); // true

    // Обновление значения
    map.set('apple', 15);
    console.log('Обновленное значение для "apple":', map.get('apple')); // 15

    // Удаление
    console.log('Удаление "orange":', map.delete('orange')); // true
    console.log('Есть ли "orange"?', map.has('orange')); // false

    // Все ключи и значения
    console.log('Ключи:', map.keys());
    console.log('Значения:', map.values());
    console.log('Все записи:', map.entries());

    // Очистка
    map.clear();
    console.log('Размер после очистки:', map.getSize()); // 0
}

// Тестирование с разными типами ключей
function testWithDifferentKeyTypes() {
    const map = new HashMap<any, string>();

    // Строковые ключи
    map.set('name', 'John');

    // Числовые ключи
    map.set(42, 'The answer');

    // Объектные ключи
    const objKey = { id: 1, name: 'test' };
    map.set(objKey, 'Object value');

    console.log('Объектный ключ:', map.get(objKey)); // 'Object value'

    // Массивы как ключи
    map.set([1, 2, 3], 'Array value');
}

// Запуск демонстрации
demonstrateHashMap();
testWithDifferentKeyTypes();