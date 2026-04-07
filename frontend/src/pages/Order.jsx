import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Order() {
  const { customerId } = useParams();

  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    status: "",
    paymentStatus: "",
  });

  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const getOrders = async () => {
    let res = await fetch(
      `http://localhost:5500/api/v10/orders/${customerId}?page=${page}&search=${search}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    res = await res.json();
    if (res.success) {
      setOrders(res.orders);
    }
  };
  useEffect(() => {
    getOrders();
  }, [page, search]);

  const addOrder = async (e) => {
    e.preventDefault();

    let res = await fetch(
      `http://localhost:5500/api/v10/orders/${customerId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    res = await res.json();
    if (res.success) {
      setFormData({
        productName: "",
        price: "",
        status: "",
        paymentStatus: "",
      });
      getOrders();
    }
  };

  const handleEdit = async (order) => {
    setFormData({
      productName: order.productName,
      price: order.price,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
    setEditId(order._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let res = await fetch(
      `http://localhost:5500/api/v10/orders/${customerId}/${editId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    res = await res.json();
    if (res.success) {
      setFormData({
        productName: "",
        price: "",
        status: "",
        paymentStatus: "",
      });
      setEditId(null);
      getOrders();
    }
  };

  const handleDelete = async (id) => {
    let res = await fetch(`http://localhost:5500/api/v10/orders/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    res = await res.json();
    if (res.success) {
      alert("Order deleted successfullu");
      getOrders();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <input
        type="text"
        placeholder="Search..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form
        onSubmit={editId ? handleUpdate : addOrder}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="Product"
          name="productName"
          className="border p-2"
          value={formData.productName}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Price"
          name="price"
          className="border p-2"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Status"
          name="status"
          className="border p-2"
          value={formData.status}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Payment"
          name="paymentStatus"
          className="border p-2"
          value={formData.paymentStatus}
          onChange={handleChange}
        />

        <button className="bg-blue-500 text-white px-4">
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({
                productName: "",
                price: "",
                status: "",
                paymentStatus: "",
              });
            }}
            className="bg-gray-400 text-white px-4"
          >
            Cancel
          </button>
        )}
      </form>

      {/* 📋 Orders List */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="grid gap-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 flex justify-between items-center"
            >
              {/* Left Side - Order Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {o.productName}
                </h2>

                <p className="text-sm text-gray-600">₹ {o.price}</p>

                {/* Status Badges */}
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {o.status}
                  </span>

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      o.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(o)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(o._id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 px-3"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage(page + 1)} className="bg-gray-300 px-3">
          Next
        </button>
      </div>
    </div>
  );
}

export default Order;
