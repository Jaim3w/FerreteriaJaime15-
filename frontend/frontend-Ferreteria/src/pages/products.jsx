import React, { useEffect, useState } from "react";
import { FaPlus, FaStore } from "react-icons/fa";
import editar from "../assets/editar.png";
import eliminar from "../assets/eliminar.png";
import Swal from "sweetalert2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los productos", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok)
        throw new Error(editingId ? "Error al editar el producto" : "Error al agregar el producto");

      setForm({ name: "", description: "", price: "", stock: "" });
      setEditingId(null);
      fetchProducts();

      Swal.fire({
        icon: "success",
        title: editingId ? "Producto actualizado" : "Producto agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const Edit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setEditingId(product._id);
  };

  const Delete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar el producto");

        fetchProducts();

        Swal.fire("¡Eliminado!", "El producto fue eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <FaStore /> Gestión de Productos
      </h2>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción del producto"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio del producto"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock del producto"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 col-span-full"
        >
          <FaPlus />
          {editingId ? "Guardar Cambios" : "Agregar producto"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900 font-semibold">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3 italic text-gray-700">{product.description}</td>
                <td className="p-3 italic text-gray-700">${product.price}</td>
                <td className="p-3 italic text-gray-700">{product.stock}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => Edit(product)}
                      className="p-1 rounded hover:bg-blue-100 transition"
                      title="Editar"
                    >
                      <img src={editar} alt="Editar" className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => Delete(product._id)}
                      className="p-1 rounded hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <img src={eliminar} alt="Eliminar" className="w-6 h-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4 italic">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
