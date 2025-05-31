// insert_books.js

const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb://127.0.0.1:27017"; 
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    const booksToInsert = [
      {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        genre: "Finance",
        published_year: 1997,
        price: 12.99,
        in_stock: true,
        pages: 207,
        publisher: "Warner Books"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        published_year: 2018,
        price: 15.99,
        in_stock: true,
        pages: 320,
        publisher: "Penguin Random House"
      },
      {
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        genre: "Finance",
        published_year: 1937,
        price: 10.99,
        in_stock: true,
        pages: 238,
        publisher: "The Ralston Society"
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        published_year: 1988,
        price: 13.5,
        in_stock: true,
        pages: 208,
        publisher: "HarperTorch"
      },
      {
        title: "My Life in Crime",
        author: "John Kiriamiti",
        genre: "Biography",
        published_year: 1980,
        price: 9.99,
        in_stock: false,
        pages: 256,
        publisher: "East African Publishing House"
      },
      {
        title: "My Life with a Criminal",
        author: "Wambui Waiyaki Otieno",
        genre: "Biography",
        published_year: 1999,
        price: 11.99,
        in_stock: true,
        pages: 240,
        publisher: "East African Educational Publishers"
      },
      {
        title: "The Hating Game",
        author: "Sally Thorne",
        genre: "Romance",
        published_year: 2016,
        price: 14.99,
        in_stock: true,
        pages: 384,
        publisher: "William Morrow Paperbacks"
      },
      {
        title: "It Ends with Us",
        author: "Colleen Hoover",
        genre: "Romance",
        published_year: 2016,
        price: 13.99,
        in_stock: false,
        pages: 376,
        publisher: "Atria Books"
      },
      {
        title: "The River Between",
        author: "Ngũgĩ wa Thiong’o",
        genre: "Fiction",
        published_year: 1965,
        price: 9.5,
        in_stock: true,
        pages: 160,
        publisher: "Heinemann"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        published_year: 1960,
        price: 12.99,
        in_stock: true,
        pages: 281,
        publisher: "J.B. Lippincott & Co."
      }
    ];

    const result = await books.insertMany(booksToInsert);
    console.log(`${result.insertedCount} books inserted.`);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
