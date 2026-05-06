const OrderItemRow = ({ item }) => {
  const product = item.product || {};
  const name = product.title || product.name;
  const image = product.thumbnail || product.image;
  const price = Number(item.price);
  const lineTotal = (price * item.quantity).toFixed(2);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            ${price.toFixed(2)} × {item.quantity}
          </p>
        </div>
      </div>
      <p className="text-sm font-bold text-gray-900">${lineTotal}</p>
    </div>
  );
};

export default OrderItemRow;
