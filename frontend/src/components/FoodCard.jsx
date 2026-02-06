import "./FoodCard.css";

const FoodCard = ({ food, onAdd }) => {
  return (
    <div className="food-card">
      {/* 🔥 IMAGE WRAPPER */}
      <div className="food-image-wrapper">
        <img
          src={food.image || "https://via.placeholder.com/300x200"}
          alt={food.name}
        />
      </div>

      <div className="food-info">
        <h4>{food.name}</h4>
        <p className="food-price">₹ {food.price}</p>

        <button type="button" className="add-btn" onClick={() => onAdd(food)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
