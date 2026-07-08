import { useParams } from "react-router-dom";
import products from "../data/Products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2>Product Not Found</h2>;
  }

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <img src={product.image} alt={product.name} />

      <h1>{product.name}</h1>

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;