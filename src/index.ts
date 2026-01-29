interface IEvent {
    id: number;
    date: string; // формат "DD-MM-YYYY"
    title: string;
}

// Базовый интерфейс итератора
interface IIterator<T> {
    current(): T;
    next(): T | null;
    hasNext(): boolean;
    reset(): void;
}

// Конкретная коллекция
class EventCollection {
    private events: IEvent[] = [];

    constructor(events: IEvent[] = []) {
        this.events = [...events];
    }

    addEvent(event: IEvent): void {
        this.events.push(event);
    }

    // Итератор по ID (по возрастанию)
    createIdIIterator(): IIterator<IEvent> {
        return new IdIIterator([...this.events]);
    }

    // Итератор по дате (хронологический порядок)
    createDateIIterator(): IIterator<IEvent> {
        return new DateIIterator([...this.events]);
    }

    // Можно добавить другие итераторы при необходимости
    getEvents(): IEvent[] {
        return [...this.events];
    }
}

// Итератор по ID (сортировка по возрастанию ID)
class IdIIterator implements IIterator<IEvent> {
    private position: number = 0;
    private sortedEvents: IEvent[];

    constructor(events: IEvent[]) {
        // Сортируем по ID
        this.sortedEvents = [...events].sort((a, b) => a.id - b.id);
    }

    current(): IEvent {
        if (this.position < this.sortedEvents.length) {
            return this.sortedEvents[this.position];
        }
        throw new Error('No more elements');
    }

    next(): IEvent | null {
        if (this.hasNext()) {
            const event = this.sortedEvents[this.position];
            this.position++;
            return event;
        }
        return null;
    }

    hasNext(): boolean {
        return this.position < this.sortedEvents.length;
    }

    reset(): void {
        this.position = 0;
    }
}

// Итератор по дате (хронологический порядок)
class DateIIterator implements IIterator<IEvent> {
    private position: number = 0;
    private sortedEvents: IEvent[];

    constructor(events: IEvent[]) {
        // Парсим даты для правильной сортировки
        this.sortedEvents = [...events].sort((a, b) => {
            const dateA = this.parseDate(a.date);
            const dateB = this.parseDate(b.date);
            return dateA.getTime() - dateB.getTime();
        });
    }

    // Преобразуем строку "DD-MM-YYYY" в Date объект
    private parseDate(dateStr: string): Date {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    current(): IEvent {
        if (this.position < this.sortedEvents.length) {
            return this.sortedEvents[this.position];
        }
        throw new Error('No more elements');
    }

    next(): IEvent | null {
        if (this.hasNext()) {
            const event = this.sortedEvents[this.position];
            this.position++;
            return event;
        }
        return null;
    }

    hasNext(): boolean {
        return this.position < this.sortedEvents.length;
    }

    reset(): void {
        this.position = 0;
    }
}

// Пример использования
function demo() {
    // Создаем коллекцию событий
    const events = new EventCollection([
        { id: 3, date: "15-03-2023", title: "Встреча" },
        { id: 1, date: "10-01-2023", title: "День рождения" },
        { id: 4, date: "20-05-2023", title: "Конференция" },
        { id: 2, date: "05-02-2023", title: "Совещание" }
    ]);

    console.log('=== Итерация по ID (сортировка по возрастанию ID) ===');
    const idIIterator = events.createIdIIterator();

    while (idIIterator.hasNext()) {
        const event = idIIterator.next();
        if (event) {
            console.log(`ID: ${event.id}, Дата: ${event.date}, Заголовок: ${event.title}`);
        }
    }

    console.log('\n=== Итерация по дате (хронологический порядок) ===');
    const dateIIterator = events.createDateIIterator();

    while (dateIIterator.hasNext()) {
        const event = dateIIterator.next();
        if (event) {
            console.log(`ID: ${event.id}, Дата: ${event.date}, Заголовок: ${event.title}`);
        }
    }

    console.log('\n=== Сброс и повторная итерация ===');
    dateIIterator.reset();

    // Используем for...of стиль
    const IIterator = events.createIdIIterator();
    let item;
    while ((item = IIterator.next()) !== null) {
        console.log(`Итерация: ${item.title}`);
    }
}

// Запуск демо
demo();