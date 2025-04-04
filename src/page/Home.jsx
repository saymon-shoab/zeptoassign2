import React, { useEffect, useRef, useState } from "react";
import { Image, Pagination, Spinner, Table , Form} from "react-bootstrap";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(totalPages)
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [genres, setGenres] = useState([]);
  const searchTimeout = useRef(null);
  useEffect(() => {
    setLoading(true);
    fetch(`https://gutendex.com/books/?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
        setFilteredBooks(data.results);
        setTotalPages(Math.ceil(data.count / 20));
        // Extract unique genres
        const allGenres = new Set();
        data.results.forEach((book) => {
          if (book.subjects) {
            book.subjects.forEach((subject) => allGenres.add(subject));
          }
        });
        setGenres(["All", ...Array.from(allGenres)]);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);


  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(() => {
      let filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (genreFilter !== "All") {
        filtered = filtered.filter(book => book.subjects && book.subjects.includes(genreFilter));
      }
      
      setFilteredBooks(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery, books, genreFilter]);


  return (
    <div className="container mt-4">
      <h2>Book List</h2>
      <Form className="mb-3 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Form.Select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Form.Select>
      </Form>
      {loading ? (
        <div
          className="spinner-container d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
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
              {filteredBooks.map((book) => (
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default Home;
