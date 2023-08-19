class User {
  id: number;
  name: string;
  totalBook: number;
  fine: number;
  booksBorrowed: Book[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.totalBook = 0;
    this.fine = 0;
    this.booksBorrowed = [];
  }

  payFine() {
    this.fine = 0;
  }
}

class Book {
  id: number;
  name: string;
  authorName: string;
  borrowedDate: Date | null;
  returnDate: Date | null;
  isAvailable: boolean;

  constructor(id: number, name: string, authorName: string) {
    this.id = id;
    this.name = name;
    this.authorName = authorName;
    this.borrowedDate = null;
    this.returnDate = null;
    this.isAvailable = true;
  }
}

class Admin {
  borrowedBooks: Map<User, Book[]>;

  constructor() {
    this.borrowedBooks = new Map();
  }

  borrowBook(user: User, book: Book) {
    if (user.fine > 0) {
      return "To issue a new book. Please clear your last late fees.";
    } else if (!book.isAvailable) {
      return "I am sorry! The book is not available.";
    } else {
      book.isAvailable = false;
      book.borrowedDate = new Date();
      const returnedDate = new Date();
      returnedDate.setDate(returnedDate.getDate() + 7);
      book.returnDate = returnedDate;

      user.booksBorrowed.push(book);

      let books = this.borrowedBooks.get(user) ?? [];
      books.push(book);
      this.borrowedBooks.set(user, books);

      return `The ${book.name} has been issued to ${
        user.name
      } on ${book.borrowedDate.toLocaleDateString()} at ${book.borrowedDate.toLocaleTimeString()} and should be returned by ${book.returnDate.toLocaleDateString()} at ${book.returnDate.toLocaleTimeString()}.`;
    }
  }

  returnBook(user: User, book: Book) {
    const currentDate = Date.now();

    if (book.returnDate && currentDate > book.returnDate.getTime()) {
      const daysLate =
        (currentDate - book.returnDate.getTime()) / (1000 * 60 * 60 * 24);
      const FINE_PER_DAY = 2;
      const fine = daysLate * FINE_PER_DAY;
      user.fine += fine;

      console.log(
        `You were ${daysLate} days late. Hence ${user.name}(${user.id}) is fined ${fine} $.`
      );
    }

    user.booksBorrowed = user.booksBorrowed.filter((bk) => bk !== book);
    book.isAvailable = true;
    book.returnDate = null;
    book.borrowedDate = null;

    return `${book.name} (${book.id}) has been returned by ${user.name} (${user.id}).`;
  }
}

const book1 = new Book(1, "The Catcher in the Rye", "J.D. Salinger");
const book2 = new Book(2, "To Kill a Mockingbird", "Harper Lee");
const book3 = new Book(3, "Atomic Habits", "James Clear");

const user1 = new User(1, "Alice");
const user2 = new User(2, "Bob");

const admin = new Admin();

console.log(admin.borrowBook(user1, book1));
console.log(admin.borrowBook(user2, book2));

console.log(admin.returnBook(user1, book2));
console.log(admin.borrowBook(user1, book3));
