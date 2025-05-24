import React, { useEffect, useState } from "react";
import { FaPlus, FaStore } from "react-icons/fa";
import editar from "../assets/editar.png";
import eliminar from "../assets/eliminar.png";
import Swal from "sweetalert2";

const MAX_IMAGE_SIZE_MB = 2;

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    telephone: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/providers");
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      Swal.fire("Archivo no válido", "Solo se permiten imágenes", "warning");
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      Swal.fire(
        "Imagen demasiado grande",
        `La imagen debe pesar menos de ${MAX_IMAGE_SIZE_MB} MB`,
        "warning"
      );
      return;
    }

    setFile(selectedFile);
  };

  const guardarActualizar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("telephone", form.telephone);
    if (file) {
      formData.append("image", file);
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/providers/${editingId}`
        : "http://localhost:5000/api/providers";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok)
        throw new Error(
          editingId
            ? "Error al editar el proveedor"
            : "Error al agregar el proveedor"
        );

      setForm({ name: "", telephone: "" });
      setFile(null);
      setEditingId(null);
      fetchProviders();

      Swal.fire({
        icon: "success",
        title: editingId ? "Proveedor actualizado" : "Proveedor agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const Edit = (provider) => {
    setForm({
      name: provider.name,
      telephone: provider.telephone,
    });
    setEditingId(provider._id);
  };

  const Eliminar = async (id) => {
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
        const response = await fetch(`http://localhost:5000/api/providers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar el proveedor");

        fetchProviders();

        Swal.fire("¡Eliminado!", "El proveedor fue eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <FaStore /> Gestión de Proveedores
      </h2>

      <form
        onSubmit={guardarActualizar}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del proveedor"
          className="p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Teléfono del proveedor"
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
          {editingId ? "Guardar Cambios" : "Agregar Proveedor"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900 font-semibold">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Imagen</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-blue-500 italic">
                  Cargando proveedores...
                </td>
              </tr>
            ) : providers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4 italic">
                  No hay proveedores registrados.
                </td>
              </tr>
            ) : (
              providers.map((prov) => (
                <tr
                  key={prov._id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="p-3">{prov.name}</td>
                  <td className="p-3">{prov.telephone}</td>
                  <td className="p-3">
                    {prov.image ? (
                      <img
                        src={prov.image}
                        alt={prov.name}
                        className="h-16 w-28 object-cover rounded-md shadow-sm border"
                      />
                    ) : (
                      <div className="text-gray-400 italic">Sin imagen</div>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => Edit(prov)}
                      className="p-1 rounded hover:bg-blue-100 transition"
                      title="Editar"
                    >
                      <img src={editar} alt="Editar" className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => Eliminar(prov._id)}
                      className="p-1 rounded hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <img src={eliminar} alt="Eliminar" className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Providers;
