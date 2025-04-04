import { useEffect, useState } from "react";
import { Table, Image } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);
// remove from wishlist function
  const removeFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((book) => book.id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="container mt-4">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No books added to wishlist yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ID</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.formats["image/jpeg"] ? (
                    <Image
                      src={book.formats["image/jpeg"]}
                      alt={book.title}
                      thumbnail
                      width={80}
                    />
                  ) : (
                    "No Cover"
                  )}
                </td>
                <td>{book.title}</td>
                <td>
                  {book.authors.length > 0
                    ? book.authors.map((author) => author.name).join(", ")
                    : "Unknown"}
                </td>
                <td>{book.subjects ? book.subjects.join(", ") : "N/A"}</td>
                <td>{book.id}</td>
                <td>
                  <FaHeart color="red"
                   onClick={() => removeFromWishlist(book.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default WishList;
