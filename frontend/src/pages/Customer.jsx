import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const getCustomer = async () => {
    let res = await fetch(
      `http://localhost:5500/api/v10/customers?page=${page}&search=${search}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    res = await res.json();
    if (res.success) {
      setCustomers(res.customers);
    }
  };
  useEffect(() => {
    getCustomer();
  }, [page, search]);

  const addCustomer = async (e) => {
    e.preventDefault();
    console.log("Function call hua");
    console.log("Data", formData);

    let res = await fetch("http://localhost:5500/api/v10/customers/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log("FETCH RESPONSE AAYA 🔥");
    res = await res.json();
    console.log(res);

    if (res.success) {
      setFormData({
        name: "",
        phone: "",
        address: "",
      });
      getCustomer();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    });

    setEditId(customer._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let res = await fetch(`http://localhost:5500/api/v10/customers/${editId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    res = await res.json();
    if (res.success) {
      setFormData({
        name: "",
        phone: "",
        address: "",
      });
      setEditId(null);
      getCustomer();
    }
  };

  const handleDelete = async (id) => {
    let res = await fetch(`http://localhost:5500/api/v10/customers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    res = await res.json();
    if (res.success) {
      alert(res.message);
      getCustomer();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ Add Form */}
      <form
        onSubmit={editId ? handleUpdate : addCustomer}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="border p-2"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Phone"
          className="border p-2"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Address"
          name="address"
          className="border p-2"
          value={formData.address}
          onChange={handleChange}
        />

        <button className="bg-blue-500 text-white px-4" type="submit">
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ name: "", phone: "", address: "" });
            }}
            className="bg-gray-400 text-white px-4"
          >
            Cancel
          </button>
        )}
      </form>

      {/* 📋 Customers List */}
      {customers.length === 0 && (
        <p className="p-4 text-center text-gray-500">No customers found</p>
      )}
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="grid gap-4">
          {customers.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 flex justify-between items-center"
            >
              {/* Left Side - Customer Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {c.name}
                </h2>
                <p className="text-sm text-gray-600">{c.phone}</p>
                <p className="text-xs text-gray-400">{c.address}</p>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(c._id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  🗑 Delete
                </button>

                <button
                  onClick={() => navigate(`/customers/${c._id}/orders`)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  📦 Orders
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

export default Customer;
