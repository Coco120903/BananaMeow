import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  Upload,
  Image as ImageIcon,
  XCircle
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        displayName: category.displayName,
        description: category.description || ""
      });
      setImagePreview(category.imageUrl ? `${API_BASE}${category.imageUrl}` : "");
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        displayName: "",
        description: ""
      });
      setImagePreview("");
    }
    setImageFile(null);
    setImageError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview("");
    setImageError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setImageError("Only JPG, PNG, WEBP images are allowed.");
        setImageFile(null);
        setImagePreview("");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size must be less than 5MB.");
        setImageFile(null);
        setImagePreview("");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    } else {
      setImageFile(null);
      setImagePreview(editingCategory?.imageUrl ? `${API_BASE}${editingCategory.imageUrl}` : "");
      setImageError("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("displayName", formData.displayName);
    submitFormData.append("description", formData.description);

    if (imageFile) {
      submitFormData.append("image", imageFile);
    } else if (editingCategory && !imagePreview) {
      submitFormData.append("removeImage", "true");
    }

    try {
      const url = editingCategory
        ? `${API_BASE}/api/categories/${editingCategory._id}`
        : `${API_BASE}/api/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitFormData
      });

      if (response.ok) {
        fetchCategories();
        closeModal();
      } else {
        const errorData = await response.json();
        setImageError(errorData.message || "Failed to save category.");
      }
    } catch (error) {
      console.error("Failed to save category:", error);
      setImageError("An unexpected error occurred.");
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone if products are using it.")) return;

    try {
      const response = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Tag className="w-7 h-7" />
            Product Categories
          </h1>
          <p className="text-ink/60">Manage product categories and their images</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal to-royal/90 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50 hover:shadow-lg transition-all"
            >
              <div className="relative mb-2">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-banana-200 to-banana-300 flex items-center justify-center">
                  {category.imageUrl ? (
                    <img
                      src={`${API_BASE}${category.imageUrl}`}
                      alt={category.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Tag className="w-6 h-6 text-royal" />
                  )}
                </div>
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3 text-ink/60" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-royal text-sm">{category.displayName}</h3>
              {category.description && (
                <p className="text-xs text-ink/50 line-clamp-1 mt-0.5">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <Tag className="w-16 h-16 mx-auto text-ink/20 mb-4" />
          <p className="text-ink/50">No categories found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-ink/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                <Tag className="w-5 h-5" />
                {editingCategory ? "Edit Category" : "Add New Category"}
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
                  Category Name (URL-friendly) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="e.g., apparel, cat-items"
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
                <p className="text-xs text-ink/40 mt-1">Lowercase, no spaces (use hyphens)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="e.g., Apparel, Cat Items"
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Brief description of this category..."
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Category Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-cream border border-ink/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Category Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-ink/30" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-royal text-white rounded-xl font-medium cursor-pointer hover:bg-royal/90 transition-colors">
                      <Upload className="w-4 h-4" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <button type="button" onClick={handleRemoveImage} className="inline-flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <XCircle className="w-4 h-4" />
                        Remove Image
                      </button>
                    )}
                    {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                  </div>
                </div>
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
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
