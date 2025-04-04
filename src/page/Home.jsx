import React, { useEffect, useState } from "react";
import { Image, Pagination, Spinner, Table } from "react-bootstrap";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  console.log("currentPage", currentPage)
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    setLoading(true);
    fetch(`https://gutendex.com/books/?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setBooks(data.results);
        setTotalPages(Math.ceil(data.count/10))
      })
      .finally(() => setLoading(false));
  }, [currentPage]);
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
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()]
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                .map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => setCurrentPage(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
            </>
        )
      }
    </div>
  );
};

export default Home;
