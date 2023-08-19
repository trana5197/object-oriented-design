interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  description: string;
}

class Orders {
  userId: number;
  items: Product[];
  totPrice: number;

  constructor(userId: number) {
    this.userId = userId;
    this.items = [];
    this.totPrice = 0;
  }
}

class Cart {
  userId: number;
  cartItems: Product[];
  totPrice: number;
  totQuantity: number;

  constructor(userId: number) {
    this.userId = userId;
    this.cartItems = [];
    this.totPrice = 0;
    this.totQuantity = 0;
  }

  addProductToCart(product: Product) {
    this.cartItems.push(product);
  }
}

class Wishlist {
  userId: number;
  wishlistItems: Product[];

  constructor(userId: number) {
    this.userId = userId;
    this.wishlistItems = [];
  }
}

class ProductItem {
  prodId: number;
  name: string;
  price: number;
  rating: number | null;
  description: string;
  quantity: number;

  constructor(
    prodId: number,
    name: string,
    price: number,
    desc: string,
    quantity: number
  ) {
    this.prodId = prodId;
    this.name = name;
    this.price = price;
    this.rating = null;
    this.description = desc;
    this.quantity = quantity;
  }
}

class Users {
  userId: number = Date.now();
  name: string;
  address: string;
  email: string;
  cart: Cart = new Cart(this.userId);
  wishlist: Wishlist = new Wishlist(this.userId);
  orders: Orders = new Orders(this.userId);

  constructor(name: string, address: string, email: string) {
    this.name = name;
    this.address = address;
    this.email = email;
  }

  addToCart(userId: number, product: Product) {
    this.cart.addProductToCart(product);
  }
}

class ShoppingSystem {
  database: Map<number, Product[]>;

  constructor() {
    this.database = new Map();
  }

  addProductToUser(user: Users, product: Product) {
    user.addToCart(user.userId, product);

    if (this.database.has(user.userId)) {
      const newProdArray = this.database.get(user.userId);

      if (newProdArray) {
        newProdArray.push(product);
      } else {
        this.database.set(user.userId, [product]);
      }
    }
  }
}

const shoppingSystem = new ShoppingSystem();
const user = new Users("John Doe", "123 Main St", "john@example.com");
const product1: Product = {
  id: 1,
  name: "Product A",
  price: 10,
  rating: 4,
  description: "A wonderful product",
};

shoppingSystem.addProductToUser(user, product1);
console.log(user.cart.cartItems);
