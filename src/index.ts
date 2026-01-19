class User {
    skills: string[] = [];

    addSkill(skill: string | string[]) {
        if (Array.isArray(skill)) {
            this.skills.push(...skill);
        } else {
            this.skills.push(skill);
        }
    }
}

const user = new User();

user.addSkill(['JavaScript', 'TypeScript']);
console.log(user);
user.addSkill('Python');
console.log(user);

/*
Необходимо сделать корзину (Cart) на сайте,

которая имееет список продуктов (Product), добавленных в корзину

и переметры доставки (Delivery). Для Cart реализовать методы:

Добавить продукт в корзину
Удалить продукт из корзины по ID
Посчитать стоимость товаров в корзине
Задать доставку
Checkout - вернуть что всё ок, если есть продукты и параметры доставки
Product: id, название и цена

Delivery: может быть как до дома (дата и адрес) или до пункта выдачи (дата = Сегодня и Id магазина)
 */
class Product {
    constructor(
        public id: number,
        public title: string,
        public price: number
    ) {
    }
}

class Delivery {
    constructor(
        public type: 'home' | 'pickup',
        public date: Date,
        public address?: string,
        public shopId?: number
    ) {
    }
}

class Cart {
    private products: Product[] = [];
    private delivery: Delivery

    checkout() {
        if (this.products.length > 0 && this.delivery) {
            console.log('Корзина не пуста и доставка задана');
        } else {
            console.log('Корзина пуста или доставка не задана');
        }
    }

    addProduct(product: Product) {
        if (this.products.includes(product)) {
            console.log('Продукт уже в корзине');
        } else {
            this.products.push(product);
        }
    }

    deleteProduct(id: number) {
        this.products = this.products.filter(product => {
            return product.id !== id;
        });
    }

    getTotalPrice() {
        return this.products.reduce((acc, product) => {
            return acc + product.price;
        }, 0);
    }

    setDelivery(delivery: Delivery) {
        if (this.products.length > 0) {
            this.delivery = delivery;
        } else {
            console.log('Корзина пуста');
        }
    }

    getDelivery() {
        if (this.delivery) {
            return this.delivery;
        } else {
            console.log('Доставка не задана');
        }
    }
}

const cart = new Cart();
console.log(cart);
cart.addProduct(new Product(1, 'Товар 1', 100));
cart.addProduct(new Product(2, 'Товар 2', 200));
console.log(cart);
cart.checkout()
cart.setDelivery(new Delivery('home', new Date(), 'Адрес доставки', 1));
cart.checkout()
console.log(cart.getTotalPrice());

/*
Необходимо реализовать абстрактный класс Logger с 2-мя методами абстрактным - log(message): void и printDate - выводящий в log дату.

К нему необходимо сделать реальный класс, который бы имел метод: logWithDate,выводящий сначала дату, а потом заданное сообщение
 */

abstract class Logger {
    abstract log(message: string): void;

    printDate() {
        this.log(new Date().toISOString());
    }
}

class RealLogger extends Logger {
    log(message: string): void {
        console.log(message);
    }
}

const logger = new RealLogger();
logger.printDate();
logger.log('Hello, world!');