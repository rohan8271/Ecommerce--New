import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

export default function Product(props) {
  const { product } = props;
  return (
    <div Key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <div className="price">₹{product.price}</div>
        <div>
          {product.countInStock > 0 ? (
            <span className="success">In Stock</span>
          ) : (
            <span className="danger">Out of Stock</span>
          )}
        </div>
        <div>
          {product.countInStock <= 10 && product.countInStock > 0 ? (
            <span className="success">
              {<div className="color1">Only {product.countInStock} left !</div>}
            </span>
          ) : (
            <span className="success">
              {product.countInStock <= 0 && "Coming soon"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
