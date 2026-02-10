import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  Tag
} from "lucide-react";

const categories = ["Apparel", "Cat items", "Accessories"];

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "Apparel",
    price: "",
    description: "",
    inventory: ""
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        inventory: product.inventory?.toString() || "0"
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "Apparel",
        price: "",
        description: "",
        inventory: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: parseInt(formData.inventory) || 0
    };

    try {
      const url = editingProduct
        ? `${API_BASE}/api/products/${editingProduct._id}`
        : `${API_BASE}/api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product? 🛍️")) return;

    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <Package className="w-7 h-7" />
            Royal Merchandise
          </h1>
          <p className="text-ink/60">Manage your Banana Meow shop products</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal to-royal/90 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b border-ink/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Inventory
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-ink/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-banana-200 to-banana-300 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-royal" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-ink/50 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-lilac/50 text-royal text-sm rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-ink">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.inventory > 10
                            ? "bg-mint/50 text-emerald-700"
                            : product.inventory > 0
                            ? "bg-banana-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inventory || 0} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 hover:bg-cream rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-ink/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <Package className="w-16 h-16 mx-auto text-ink/20 mb-4" />
          <p className="text-ink/50">No products in the royal shop yet 🛍️</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-ink/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                <Tag className="w-5 h-5" />
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1">
                    Inventory
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) =>
                      setFormData({ ...formData, inventory: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-ink/20 rounded-xl hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-royal to-royal/90 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? "Update" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
