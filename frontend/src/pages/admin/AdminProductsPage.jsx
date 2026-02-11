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
  Tag,
  FileDown,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { generateProductsPDF } from "../../utils/pdfExport.js";

export default function AdminProductsPage() {
  const { token, admin } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    inventory: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // Set default category if formData.category is empty
        if (!formData.category && data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].displayName }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to default categories
      setCategories([
        { displayName: "Apparel" },
        { displayName: "Cat items" },
        { displayName: "Accessories" }
      ]);
    }
  };

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
      setImagePreview(product.imageUrl ? `${API_BASE}${product.imageUrl}` : null);
      setRemoveImage(false);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: categories.length > 0 ? categories[0].displayName : "",
        price: "",
        description: "",
        inventory: ""
      });
      setImagePreview(null);
      setRemoveImage(false);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        alert("Please select a valid image file (JPG, PNG, or WEBP)");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setRemoveImage(false);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("inventory", formData.inventory || "0");
    
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
    
    if (removeImage && editingProduct) {
      formDataToSend.append("removeImage", "true");
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/api/products/${editingProduct._id}`
        : `${API_BASE}/api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        fetchProducts();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please try again.");
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setExporting(true);
              try {
                generateProductsPDF(filteredProducts, searchTerm, admin?.username || "Admin");
              } catch (error) {
                console.error("Failed to generate PDF:", error);
                alert("Failed to generate PDF. Please try again.");
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting || filteredProducts.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-ink/20 text-royal rounded-xl font-medium hover:bg-cream transition-all disabled:opacity-50"
            title="Export to PDF"
          >
            <FileDown className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal to-royal/90 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
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
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-banana-200 to-banana-300 flex items-center justify-center flex-shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={`${API_BASE}${product.imageUrl}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-royal" />
                          )}
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
                    <option key={cat._id || cat.displayName} value={cat.displayName}>
                      {cat.displayName}
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
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Product Image
                </label>
                {imagePreview ? (
                  <div className="relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-ink/10"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 p-8 border-2 border-dashed border-ink/20 rounded-xl text-center">
                    <ImageIcon className="w-8 h-8 text-ink/30 mx-auto mb-2" />
                    <p className="text-sm text-ink/50 mb-2">No image uploaded</p>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-2 border border-ink/20 rounded-xl hover:bg-cream transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-ink/60" />
                  <span className="text-sm text-ink/70">
                    {imagePreview ? "Replace Image" : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-ink/40 mt-1">
                  JPG, PNG, or WEBP. Max 5MB
                </p>
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
