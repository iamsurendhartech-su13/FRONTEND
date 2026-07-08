import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        background: "#333",
      }}
    >
      <h2 style={{ color: "white" }}>Product Catalog</h2>

      <div>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>
          Home
        </Link>

        <Link to="/products" style={{ color: "white", marginRight: "20px" }}>
          Products
        </Link>

        <Link to="/about" style={{ color: "white", marginRight: "20px" }}>
          About
        </Link>

        <Link to="/contact" style={{ color: "white" }}>
          Contact
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;