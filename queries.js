// queries.js

const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // --- Basic CRUD ---

    // Find all books in genre "Finance"
    const financeBooks = await books.find({ genre: "Finance" }).toArray();
    console.log("Finance books:", financeBooks);

    // Books published after 2010
    const recentBooks = await books.find({ published_year: { $gt: 2010 } }).toArray();
    console.log("Books published after 2010:", recentBooks);

    // Books by author "Paulo Coelho"
    const coelhoBooks = await books.find({ author: "Paulo Coelho" }).toArray();
    console.log("Books by Paulo Coelho:", coelhoBooks);

    // Update price of "Rich Dad Poor Dad"
    const updateResult = await books.updateOne(
      { title: "Rich Dad Poor Dad" },
      { $set: { price: 13.99 } }
    );
    console.log("Update result:", updateResult.modifiedCount);

    // Delete book "The Alchemist"
    const deleteResult = await books.deleteOne({ title: "The Alchemist" });
    console.log("Delete result:", deleteResult.deletedCount);

    // --- Advanced Queries ---

    // Books in stock and published after 2010
    const filteredBooks = await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log("In-stock books after 2010:", filteredBooks);

    // Projection: only title, author, price
    const projectionBooks = await books.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray();
    console.log("Books with projection:", projectionBooks);

    // Sort by price ascending
    const sortedAsc = await books.find().sort({ price: 1 }).toArray();
    console.log("Books sorted by price ascending:", sortedAsc);

    // Sort by price descending
    const sortedDesc = await books.find().sort({ price: -1 }).toArray();
    console.log("Books sorted by price descending:", sortedDesc);

    // Pagination: 5 books per page, page 1
    const page1 = await books.find().skip(0).limit(5).toArray();
    console.log("Page 1 (5 books):", page1);

    // Pagination: page 2
    const page2 = await books.find().skip(5).limit(5).toArray();
    console.log("Page 2 (5 books):", page2);

    // --- Aggregation Pipelines ---

    // Average price by genre
    const avgPriceByGenre = await books.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log("Average price by genre:", avgPriceByGenre);

    // Author with most books
    const topAuthor = await books.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with most books:", topAuthor);

    // Group books by decade and count
    const booksByDecade = await books.aggregate([
      {
        $group: {
          _id: { $floor: { $divide: ["$published_year", 10] } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
          count: 1,
          _id: 0
        }
      }
    ]).toArray();
    console.log("Books grouped by decade:", booksByDecade);

    // --- Indexing ---

    // Create index on title
    const idx1 = await books.createIndex({ title: 1 });
    console.log("Created index on title:", idx1);

    // Create compound index on author and published_year
    const idx2 = await books.createIndex({ author: 1, published_year: 1 });
    console.log("Created compound index on author and published_year:", idx2);

    // Explain query performance
    const explainResult = await books.find({ title: "Atomic Habits" }).explain("executionStats");
    console.log("Explain result for query on title:", JSON.stringify(explainResult.executionStats, null, 2));

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
