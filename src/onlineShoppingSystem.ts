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

class Orders {
  userId: number;
  items: ProductItem[];
  totPrice: number;

  constructor(userId: number) {
    this.userId = userId;
    this.items = [];
    this.totPrice = 0;
  }
}

class Cart {
  userId: number;
  cartItems: ProductItem[];
  totPrice: number;
  totQuantity: number;

  constructor(userId: number) {
    this.userId = userId;
    this.cartItems = [];
    this.totPrice = 0;
    this.totQuantity = 0;
  }

  addProductToCart(product: ProductItem) {
    this.cartItems.push(product);
  }

  deleteProductFromCart(product: ProductItem) {
    this.cartItems = this.cartItems.filter(
      (prod) => prod.prodId !== product.prodId
    );
  }
}

class Wishlist {
  userId: number;
  wishlistItems: ProductItem[];

  constructor(userId: number) {
    this.userId = userId;
    this.wishlistItems = [];
  }

  addProductToWishlist(product: ProductItem) {
    this.wishlistItems.push(product);
  }
}

class Users {
  userId: number;
  name: string;
  address: string;
  email: string;
  cart: Cart;
  wishlist: Wishlist;
  orders: Orders;

  constructor(name: string, address: string, email: string) {
    this.userId = Date.now();
    this.name = name;
    this.address = address;
    this.email = email;
    this.cart = new Cart(this.userId);
    this.wishlist = new Wishlist(this.userId);
    this.orders = new Orders(this.userId);
  }

  addToCart(product: ProductItem) {
    this.cart.addProductToCart(product);
  }

  addToWishlist(product: ProductItem) {
    this.wishlist.addProductToWishlist(product);
  }

  getCart() {
    if (this.cart.cartItems.length === 0) return `The cart is empty!`;

    return this.cart.cartItems;
  }

  getWishlist() {
    if (this.wishlist.wishlistItems.length === 0)
      return `The wishlist is empty!`;

    return this.wishlist.wishlistItems;
  }

  deleteFromCart(product: ProductItem) {
    this.cart.deleteProductFromCart(product);
  }
}

class ShoppingSystem {
  database: Map<number, ProductItem[]>;

  constructor() {
    this.database = new Map();
  }

  addProductToUser(user: Users, product: ProductItem) {
    user.addToCart(product);

    if (this.database.has(user.userId)) {
      const newProdArray = this.database.get(user.userId);

      if (newProdArray) {
        newProdArray.push(product);
      } else {
        this.database.set(user.userId, [product]);
      }
    } else {
      this.database.set(user.userId, [product]);
    }
  }

  addProductToWishlist(user: Users, product: ProductItem) {
    user.addToWishlist(product);
  }

  deleteProductFromUser(user: Users, product: ProductItem) {
    user.deleteFromCart(product);

    if (this.database.has(user.userId)) {
      const existingProdArray = this.database.get(user.userId);

      if (existingProdArray) {
        const index = existingProdArray.findIndex(
          (prod) => prod.prodId === product.prodId
        );

        if (index !== -1) {
          existingProdArray.splice(index, 1);

          if (existingProdArray.length === 0) {
            this.database.delete(user.userId);
          }

          return "Product deleted successfully";
        } else {
          return "Product does not exists in database";
        }
      }
    } else {
      return "User does not exists in database";
    }
  }
}

const shoppingSystem = new ShoppingSystem();
const tarun = new Users("John Doe", "123 Main St", "john@example.com");
const product1: ProductItem = {
  prodId: 1,
  name: "Product A",
  price: 10,
  description: "A wonderful product",
  quantity: 1,
  rating: null,
};

const product2: ProductItem = {
  prodId: 2,
  name: "Product B",
  price: 20,
  description: "An amzaing item this is",
  quantity: 1,
  rating: null,
};

const product3: ProductItem = {
  prodId: 3,
  name: "Product C",
  price: 40,
  description: "Excellent item",
  quantity: 1,
  rating: null,
};

shoppingSystem.addProductToUser(tarun, product1);
shoppingSystem.addProductToWishlist(tarun, product2);
shoppingSystem.addProductToUser(tarun, product3);

console.log(shoppingSystem.deleteProductFromUser(tarun, product3));

console.log(tarun.getCart());
console.log(tarun.getWishlist());
