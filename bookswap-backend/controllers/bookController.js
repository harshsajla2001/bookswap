import Book from "../models/Book.js";

export const addBook = async (req, res) => {
  console.log("🚀 [addBook] API called");

  console.log("📩 Request Headers:", req.headers);
  console.log("📦 Request Body:", req.body);
  console.log("🖼️ File Upload Body:", req.files || req.file);

  try {
    const { title, author, condition } = req.body;

    if (!title || !author || !condition) {
      console.warn("⚠️ Validation failed: Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Cloudinary uploads store URL in `path`
    const image = req.file ? req.file.path : null;

    console.log("🌐 Cloudinary Image URL:", image);
    console.log("👤 Request User Info:", req.user);

    if (!req.user || !req.user.id) {
      console.warn("⚠️ Auth issue: User not found in request!");
    } else {
      console.log("👤 User Authenticated:", req.user.id);
    }

    const newBook = new Book({
      title,
      author,
      condition,
      image,
      owner: req.user?.id || null,
    });

    console.log("📚 New Book Object Before Save:", newBook);

    await newBook.save();

    console.log("✅ Book successfully saved in DB:", newBook);

    return res.status(201).json({
      success: true,
      message: "Book added successfully!",
      book: newBook,
    });

  } catch (err) {
    console.error("❌ [addBook] Server Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      stack: err.stack,
    });
  }
};


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: { $ne: req.user.id } })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

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

    // If new image uploaded, update Cloudinary URL
    if (req.file) {
      req.body.image = req.file.path;
    }

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
