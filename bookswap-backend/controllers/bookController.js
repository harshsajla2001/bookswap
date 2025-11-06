import Book from "../models/Book.js";


export const addBook = async (req, res) => {
  console.log("📌 addBook API triggered");

  try {
    console.log("📝 Request Body:", req.body);
    console.log("🖼️ Uploaded File:", req.file);
    console.log("👤 Authenticated User:", req.user);

    const { title, author, condition } = req.body;

    if (!title || !author || !condition) {
      console.warn("⚠️ Missing required fields!");
      return res.status(400).json({ error: "All fields are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("✅ Image Path:", image);

    const newBook = new Book({
      title,
      author,
      condition,
      image,
      owner: req.user?.id || "No user found",
    });

    console.log("📦 New Book Object (before save):", newBook);

    await newBook.save();

    console.log("✅ Book saved successfully:", newBook);
    return res.status(201).json(newBook);

  } catch (err) {
    console.error("❌ Error in addBook:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    // exclude books owned by the logged-in user
    const books = await Book.find({ owner: { $ne: req.user.id } })
      .populate("owner", "name email")
      .sort({ createdAt: -1 }); // optional: show latest first

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
