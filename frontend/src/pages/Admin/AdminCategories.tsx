import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, Edit2, Trash2, Plus, X, Save, Image } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { categoryAPI } from '../../services';
import { Category } from '../../types';

export default function AdminCategories() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true,
    sortOrder: 0,
  });

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.slug && cat.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', parentId: '', isActive: true, sortOrder: 0 });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setShowModal(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      parentId: cat.parentId ? String(cat.parentId) : '',
      isActive: cat.isActive !== false,
      sortOrder: cat.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Tên danh mục là bắt buộc');
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        name: formData.name,
        isActive: formData.isActive,
        sortOrder: Number(formData.sortOrder) || 0,
      };
      if (formData.slug) data.slug = formData.slug;
      if (formData.description) data.description = formData.description;
      if (formData.image) data.image = formData.image;
      if (formData.parentId) data.parentId = Number(formData.parentId);

      if (editingCategory) {
        const updated = await categoryAPI.updateCategory(String(editingCategory.id), data);
        setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)));
      } else {
        const created = await categoryAPI.createCategory(data);
        setCategories([...categories, created]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${cat.name}"?`)) return;
    setDeletingId(String(cat.id));
    try {
      await categoryAPI.deleteCategory(String(cat.id));
      setCategories(categories.filter((c) => c.id !== cat.id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const updated = await categoryAPI.updateCategory(String(cat.id), { isActive: !cat.isActive });
      setCategories(categories.map((c) => (c.id === cat.id ? updated : c)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const parentOptions = categories.filter((c) => c.id !== editingCategory?.id);
  const freezeActions = showModal || saving;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={freezeActions}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <Button size="sm" className="w-full sm:w-auto" onClick={handleAdd} disabled={freezeActions}>
              <Plus className="w-4 h-4 mr-1" /> Thêm danh mục
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Tên danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Danh mục cha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Thứ tự</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                            if (next) next.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      <div className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center" style={{ display: cat.image ? 'none' : 'flex' }}>
                        <Image className="w-5 h-5 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm font-mono">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {cat.parentId
                        ? parentOptions.find((c) => c.id === cat.parentId)?.name || '-'
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        disabled={freezeActions}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.isActive !== false
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {cat.isActive !== false ? 'Hoạt động' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(cat)}
                          disabled={freezeActions}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={freezeActions || deletingId === String(cat.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 pt-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto space-y-4">
              <Input
                label="Tên danh mục *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Món Chính"
              />
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="VD: mon-chinh (để trống để tự động tạo)"
              />
              <Input
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả danh mục (tùy chọn)"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hình ảnh</label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Image className="w-4 h-4 mr-1" /> Tải ảnh lên
                  </Button>

                  {formData.image && (
                    <Button type="button" variant="ghost" onClick={clearSelectedImage} disabled={saving}>
                      <X className="w-4 h-4 mr-1" /> Xóa ảnh
                    </Button>
                  )}
                </div>

                {formData.image && (
                  <div className="mt-3 w-28 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục cha</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="">Không có (danh mục gốc)</option>
                  {parentOptions.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Thứ tự hiển thị"
                type="number"
                value={String(formData.sortOrder)}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-500 rounded"
                />
                <span className="text-sm text-gray-600">Hoạt động</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} disabled={saving}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
