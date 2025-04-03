import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import WishList from "./page/WishList";
import Home from "./page/Home";
import Navbars from "./components/Navbar";


function App() {
  return (
    <>
        <Router>
      <Navbars />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<WishList />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
    </>

  );
}

export default App;
