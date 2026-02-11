import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Cat,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Crown,
  Search,
  Upload,
  Image as ImageIcon
} from "lucide-react";

export default function AdminCatsPage() {
  const { token } = useAdminAuth();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    traits: "",
    funFact: "",
    favoriteThing: "",
    personality: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const fetchCats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cats`);
      if (response.ok) {
        const data = await response.json();
        setCats(data);
      }
    } catch (error) {
      console.error("Failed to fetch cats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({
        name: cat.name,
        nickname: cat.nickname,
        traits: cat.traits?.join(", ") || "",
        funFact: cat.funFact,
        favoriteThing: cat.favoriteThing,
        personality: cat.personality
      });
      setImagePreview(cat.imageUrl ? `${API_BASE}${cat.imageUrl}` : null);
      setRemoveImage(false);
    } else {
      setEditingCat(null);
      setFormData({
        name: "",
        nickname: "",
        traits: "",
        funFact: "",
        favoriteThing: "",
        personality: ""
      });
      setImagePreview(null);
      setRemoveImage(false);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCat(null);
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
    formDataToSend.append("nickname", formData.nickname);
    formDataToSend.append("traits", formData.traits);
    formDataToSend.append("funFact", formData.funFact);
    formDataToSend.append("favoriteThing", formData.favoriteThing);
    formDataToSend.append("personality", formData.personality);
    
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
    
    if (removeImage && editingCat) {
      formDataToSend.append("removeImage", "true");
    }

    try {
      const url = editingCat
        ? `${API_BASE}/api/cats/${editingCat._id}`
        : `${API_BASE}/api/cats`;
      const method = editingCat ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        fetchCats();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save cat");
      }
    } catch (error) {
      console.error("Failed to save cat:", error);
      alert("Failed to save cat. Please try again.");
    }
  };

  const handleDelete = async (catId) => {
    if (!confirm("Are you sure you want to remove this royal cat? 😿")) return;

    try {
      const response = await fetch(`${API_BASE}/api/cats/${catId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCats();
      }
    } catch (error) {
      console.error("Failed to delete cat:", error);
    }
  };

  const filteredCats = cats.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Cat className="w-7 h-7" />
            The Royal Cat Registry
          </h1>
          <p className="text-ink/60">Manage your chonky royal court</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal to-royal/90 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Cat
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search cats by name or nickname..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Cats Grid */}
      {filteredCats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCats.map((cat) => (
            <div
              key={cat._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 hover:shadow-lg transition-all"
            >
              <div className="relative mb-3">
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-banana-200 to-banana-300 flex items-center justify-center">
                  {cat.imageUrl ? (
                    <img
                      src={`${API_BASE}${cat.imageUrl}`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Cat className="w-8 h-8 text-royal" />
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openModal(cat)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-ink/60" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-royal text-lg">{cat.name}</h3>
              <p className="text-sm text-ink/60 mb-2">"{cat.nickname}"</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {cat.traits?.slice(0, 3).map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 bg-lilac/50 text-royal text-xs rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              <p className="text-xs text-ink/50 line-clamp-2">{cat.funFact}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <Cat className="w-16 h-16 mx-auto text-ink/20 mb-4" />
          <p className="text-ink/50">No cats found in the kingdom 👑</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-ink/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                <Crown className="w-5 h-5" />
                {editingCat ? "Edit Royal Cat" : "Add New Royal Cat"}
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
                  Name *
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
                  Nickname *
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder='e.g., "The Food Inspector"'
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Traits (comma separated) *
                </label>
                <input
                  type="text"
                  value={formData.traits}
                  onChange={(e) =>
                    setFormData({ ...formData, traits: e.target.value })
                  }
                  placeholder="Lazy, Dramatic, Fluffy"
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Fun Fact *
                </label>
                <textarea
                  value={formData.funFact}
                  onChange={(e) =>
                    setFormData({ ...formData, funFact: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Favorite Thing *
                </label>
                <input
                  type="text"
                  value={formData.favoriteThing}
                  onChange={(e) =>
                    setFormData({ ...formData, favoriteThing: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Personality *
                </label>
                <textarea
                  value={formData.personality}
                  onChange={(e) =>
                    setFormData({ ...formData, personality: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
                  required
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Cat Image
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
                  {editingCat ? "Update Cat" : "Add Cat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
