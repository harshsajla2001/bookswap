import Request from "../models/Request.js";
import Book from "../models/Book.js";

export const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot request your own book" });
    }

    const existing = await Request.findOne({
      book: bookId,
      requester: req.user.id,
      status: "Pending"
    });
    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const newRequest = new Request({
      book: bookId,
      requester: req.user.id,
      owner: book.owner,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .populate("book", "title author")
      .populate("owner", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ owner: req.user.id })
      .populate("book", "title author")
      .populate("requester", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findById(id)
      .populate("book")
      .populate("requester")
      .populate("owner");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["Accepted", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    request.status = status;
    await request.save();

    if (status === "Accepted") {
      const book = await Book.findById(request.book._id);

      if (book) {
        book.owner = request.requester._id;
        await book.save();
      }
    }

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });

  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: err.message });
  }
};
