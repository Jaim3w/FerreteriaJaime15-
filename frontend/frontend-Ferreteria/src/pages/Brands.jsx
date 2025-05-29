import React, { useEffect, useState } from "react";
import { FaPlus, FaStore } from "react-icons/fa";
import editar from "../assets/editar.png";
import eliminar from "../assets/eliminar.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    year: "",
    slogan: "",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("https://ferreteriajaime15.onrender.com/api/brand");
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error al obtener marcas:", error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("year", form.year);
    formData.append("slogan", form.slogan);
    if (file) {
      formData.append("image", file);
    }

    try {
      const url = editingId
        ? `https://ferreteriajaime15.onrender.com/api/brand/${editingId}`
        : "https://ferreteriajaime15.onrender.com/api/brand";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok)
        throw new Error(editingId ? "Error al editar la marca" : "Error al agregar la marca");

      await fetchBrands();
      setForm({ name: "", year: "", slogan: "" });
      setFile(null);
      setEditingId(null);

      MySwal.fire({
        icon: "success",
        title: editingId ? "Marca actualizada" : "Marca agregada",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al guardar marca:", error.message);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleEdit = (brand) => {
    setForm({
      name: brand.name,
      year: brand.year,
      slogan: brand.slogan,
    });
    setEditingId(brand._id);
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://ferreteriajaime15.onrender.com/api/brand/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar la marca");

        await fetchBrands();

        MySwal.fire({
          icon: "success",
          title: "Marca eliminada",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error al eliminar marca:", error.message);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <FaStore /> Gestión de Marcas
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre de la marca"
          className="p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Año de fundación"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="slogan"
          value={form.slogan}
          onChange={handleChange}
          placeholder="Eslogan"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded-lg md:col-span-2 lg:col-span-1"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 col-span-full"
        >
          <FaPlus />
          {editingId ? "Guardar Cambios" : "Agregar Marca"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900 font-semibold">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Año</th>
              <th className="p-3 text-left">Eslogan</th>
              <th className="p-3 text-left">Imagen</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr
                key={brand._id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="p-3">{brand.name}</td>
                <td className="p-3">{brand.year}</td>
                <td className="p-3 italic text-gray-700">"{brand.slogan}"</td>
                <td className="p-3">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="h-16 w-28 object-cover rounded-md shadow-sm border"
                    />
                  ) : (
                    <div className="text-gray-400 italic">Sin imagen</div>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="p-1 rounded hover:bg-blue-100 transition"
                    title="Editar"
                  >
                    <img src={editar} alt="Editar" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="p-1 rounded hover:bg-red-100 transition"
                    title="Eliminar"
                  >
                    <img src={eliminar} alt="Eliminar" className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4 italic">
                  No hay marcas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brands;
