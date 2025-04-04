import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://gutendex.com/books`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="container mt-4">
      <h2>Book List</h2>
      {
        loading? (
            <div className="spinner-container d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
            <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      {book.formats["image/jpeg"] ? (
                        <img
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
                  </tr>
                ))}
              </tbody>
            </Table>
            </>
        )
      }
    </div>
  );
};

export default Home;
