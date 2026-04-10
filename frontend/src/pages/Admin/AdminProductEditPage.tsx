import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Edit3, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { categoryAPI, productAPI } from '../../services';
import { Category, Product, ProductVariant } from '../../types';

interface ProductFormState {
  name: string;
  description: string;
  categoryId: string;
  mediaList: string[];
  preparationTime: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  variants: ProductVariant[];
}

interface VariantAttribute {
  id: string;
  name: string;
  values: string[];
  draftValue: string;
}

const createEmptyVariant = (): ProductVariant => ({
  id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  originalPrice: 0,
  salePrice: 0,
  quantity: 0,
});

const createEmptyAttribute = (): VariantAttribute => ({
  id: `attr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  values: [],
  draftValue: '',
});

const createInitialForm = (): ProductFormState => ({
  name: '',
  description: '',
  categoryId: '',
  mediaList: [],
  preparationTime: 10,
  isAvailable: true,
  isFeatured: false,
  isNew: false,
  variants: [createEmptyVariant()],
});

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isVideoMedia = (value: string): boolean => {
  const media = value.toLowerCase();
  return (
    media.startsWith('data:video/') ||
    media.includes('youtube.com') ||
    media.includes('youtu.be') ||
    media.includes('vimeo.com') ||
    /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(media)
  );
};

const toYouTubeEmbedUrl = (value: string): string | null => {
  try {
    const url = new URL(value);

    if (url.hostname.includes('youtube.com')) {
      const videoId = url.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.replace('/', '').trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AdminProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(null);
  const [primaryMediaIndex, setPrimaryMediaIndex] = useState(0);
  const [preservedTags, setPreservedTags] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<VariantAttribute[]>([
    { id: 'attr-size', name: 'Kích cỡ', values: ['S', 'M', 'L'], draftValue: '' },
    { id: 'attr-tool', name: 'Dụng cụ', values: ['Có', 'Không'], draftValue: '' },
  ]);
  const [defaultOriginalPrice, setDefaultOriginalPrice] = useState(0);
  const [defaultSalePrice, setDefaultSalePrice] = useState(0);
  const [defaultQuantity, setDefaultQuantity] = useState(0);
  const [form, setForm] = useState<ProductFormState>(createInitialForm);

  const title = useMemo(() => (isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'), [isEditMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryData, productData] = await Promise.all([
          categoryAPI.getAllCategories(),
          isEditMode ? productAPI.getProductById(id!) : Promise.resolve<Product | null>(null),
        ]);

        setCategories(categoryData);

        if (productData) {
          const initialMediaList = [...(productData.images || []), ...(productData.video ? [productData.video] : [])];
          setPreservedTags(productData.tags || []);
          setForm({
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId,
            mediaList: initialMediaList,
            preparationTime: productData.preparationTime || 10,
            isAvailable: productData.isAvailable,
            isFeatured: productData.isFeatured,
            isNew: productData.isNew,
            variants:
              productData.variants && productData.variants.length > 0
                ? productData.variants
                : [
                    {
                      id: `${productData.id}-default`,
                      name: 'Mặc định',
                      originalPrice: productData.originalPrice ?? productData.price,
                      salePrice: productData.price,
                      quantity: productData.isAvailable ? 100 : 0,
                    },
                  ],
          });

          const firstVariant = productData.variants?.[0];
          setDefaultOriginalPrice(firstVariant?.originalPrice ?? productData.originalPrice ?? productData.price);
          setDefaultSalePrice(firstVariant?.salePrice ?? productData.price);
          setDefaultQuantity(firstVariant?.quantity ?? (productData.isAvailable ? 100 : 0));

          const firstImageIndex = initialMediaList.findIndex((item) => !isVideoMedia(item));
          setPrimaryMediaIndex(firstImageIndex >= 0 ? firstImageIndex : 0);
        }
      } catch (error) {
        console.error('Failed to load product form data:', error);
        alert('Không thể tải dữ liệu sản phẩm');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, navigate]);

  const updateVariant = (variantId: string, field: keyof ProductVariant, value: string) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: field === 'name' ? value : toNumber(value),
            }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, createEmptyVariant()] }));
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, createEmptyAttribute()]);
  };

  const removeAttribute = (attributeId: string) => {
    setAttributes((prev) => prev.filter((attribute) => attribute.id !== attributeId));
  };

  const updateAttributeName = (attributeId: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              name: value,
            }
          : attribute
      )
    );
  };

  const updateAttributeDraftValue = (attributeId: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              draftValue: value,
            }
          : attribute
      )
    );
  };

  const addAttributeValue = (attributeId: string) => {
    setAttributes((prev) =>
      prev.map((attribute) => {
        if (attribute.id !== attributeId) return attribute;

        const normalizedValue = attribute.draftValue.trim();
        if (!normalizedValue || attribute.values.includes(normalizedValue)) {
          return {
            ...attribute,
            draftValue: '',
          };
        }

        return {
          ...attribute,
          values: [...attribute.values, normalizedValue],
          draftValue: '',
        };
      })
    );
  };

  const removeAttributeValue = (attributeId: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              values: attribute.values.filter((item) => item !== value),
            }
          : attribute
      )
    );
  };

  const generateVariantsFromAttributes = () => {
    const normalizedAttributes = attributes
      .map((attribute) => ({
        name: attribute.name.trim(),
        values: attribute.values
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter((attribute) => attribute.name && attribute.values.length > 0);

    if (normalizedAttributes.length === 0) {
      alert('Vui lòng nhập ít nhất 1 thuộc tính và các giá trị để tạo biến thể');
      return;
    }

    const combinationNames = normalizedAttributes.reduce<string[]>((acc, attribute) => {
      if (acc.length === 0) {
        return attribute.values.map((value) => `${attribute.name}: ${value}`);
      }

      return acc.flatMap((prefix) =>
        attribute.values.map((value) => `${prefix} | ${attribute.name}: ${value}`)
      );
    }, []);

    const existingVariantByName = new Map(
      form.variants.map((variant) => [variant.name.trim(), variant])
    );

    const generatedVariants = combinationNames.map((name, index) => {
      const existing = existingVariantByName.get(name);
      if (existing) {
        return existing;
      }

      return {
        id: `variant-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        originalPrice: Math.max(0, defaultOriginalPrice),
        salePrice: Math.max(0, defaultSalePrice),
        quantity: Math.max(0, Math.floor(defaultQuantity)),
      };
    });

    setForm((prev) => ({
      ...prev,
      variants: generatedVariants,
    }));
  };

  const removeVariant = (variantId: string) => {
    setForm((prev) => {
      if (prev.variants.length === 1) {
        return prev;
      }

      return {
        ...prev,
        variants: prev.variants.filter((variant) => variant.id !== variantId),
      };
    });
  };

  const handleUploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedMedia = await Promise.all(Array.from(files).map(readFileAsDataUrl));
      setForm((prev) => ({
        ...prev,
        mediaList: [...prev.mediaList, ...uploadedMedia.filter(Boolean)],
      }));

      setPrimaryMediaIndex((prevPrimary) => {
        const existingImageIndex = form.mediaList.findIndex((item) => !isVideoMedia(item));
        if (existingImageIndex >= 0) return prevPrimary;

        const appended = uploadedMedia.filter(Boolean);
        const newImageOffset = appended.findIndex((item) => !isVideoMedia(item));
        return newImageOffset >= 0 ? form.mediaList.length + newImageOffset : prevPrimary;
      });
    } catch (error) {
      console.error('Failed to upload media:', error);
      alert('Upload media thất bại');
    } finally {
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }
    }
  };

  const handleAddMediaUrl = () => {
    const url = mediaUrlInput.trim();
    if (!url) return;

    setForm((prev) => ({ ...prev, mediaList: [...prev.mediaList, url] }));

    if (!isVideoMedia(url)) {
      const hasImage = form.mediaList.some((item) => !isVideoMedia(item));
      if (!hasImage) {
        setPrimaryMediaIndex(form.mediaList.length);
      }
    }

    setMediaUrlInput('');
  };

  const updateMedia = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      mediaList: prev.mediaList.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      mediaList: prev.mediaList.filter((_, itemIndex) => itemIndex !== index),
    }));

    setEditingMediaIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });

    setPrimaryMediaIndex((prev) => {
      if (prev === index) return 0;
      return prev > index ? prev - 1 : prev;
    });
  };

  const setPrimaryImage = (index: number) => {
    if (isVideoMedia(form.mediaList[index])) return;
    setPrimaryMediaIndex(index);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.categoryId) {
      alert('Vui lòng nhập đầy đủ Tên sản phẩm, Mô tả và Danh mục');
      return;
    }

    const normalizedVariants = form.variants
      .map((variant) => ({
        ...variant,
        name: variant.name.trim() || 'Biến thể',
        originalPrice: Math.max(0, variant.originalPrice),
        salePrice: Math.max(0, variant.salePrice),
        quantity: Math.max(0, Math.floor(variant.quantity)),
      }))
      .filter((variant) => variant.salePrice > 0);

    if (normalizedVariants.length === 0) {
      alert('Vui lòng có ít nhất 1 biến thể với giá bán lớn hơn 0');
      return;
    }

    const selectedCategory = categories.find((category) => String(category.id) === form.categoryId);
    if (!selectedCategory) {
      alert('Danh mục không hợp lệ');
      return;
    }

    const normalizedMedia = form.mediaList
      .map((item) => item.trim())
      .filter(Boolean);

    const images = normalizedMedia.filter((item) => !isVideoMedia(item));
    const video = normalizedMedia.find((item) => isVideoMedia(item));

    if (images.length === 0) {
      alert('Vui lòng thêm ít nhất 1 ảnh sản phẩm');
      return;
    }

    const primaryCandidate = normalizedMedia[primaryMediaIndex];
    const orderedImages = (!primaryCandidate || isVideoMedia(primaryCandidate))
      ? images
      : [
          primaryCandidate,
          ...images.filter((item) => item !== primaryCandidate),
        ];

    const minSalePrice = Math.min(...normalizedVariants.map((variant) => variant.salePrice));
    const maxOriginalPrice = Math.max(...normalizedVariants.map((variant) => variant.originalPrice));
    const totalQuantity = normalizedVariants.reduce((sum, variant) => sum + variant.quantity, 0);

    const payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: String(selectedCategory.id),
      categoryName: selectedCategory.name,
      images: orderedImages,
      tags: preservedTags,
      preparationTime: Math.max(1, Math.floor(form.preparationTime || 1)),
      isAvailable: form.isAvailable && totalQuantity > 0,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      variants: normalizedVariants,
      price: minSalePrice,
      originalPrice: maxOriginalPrice > minSalePrice ? maxOriginalPrice : undefined,
      rating: 0,
      reviewCount: 0,
      calories: undefined,
      ingredients: [],
      allergens: [],
      video,
    };

    setSaving(true);
    try {
      if (isEditMode) {
        await productAPI.updateProduct(id!, payload);
      } else {
        await productAPI.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 w-48 rounded-lg bg-gray-200" />
        <div className="h-80 rounded-2xl bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên sản phẩm *"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="VD: Gà rán sốt cay"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục *</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả *</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            placeholder="Mô tả chi tiết sản phẩm"
          />
        </div>

        <Input
          label="Thời gian chuẩn bị (phút)"
          type="number"
          value={String(form.preparationTime)}
          onChange={(event) => setForm((prev) => ({ ...prev, preparationTime: toNumber(event.target.value) }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(event) => setForm((prev) => ({ ...prev, isAvailable: event.target.checked }))}
              className="w-4 h-4 text-red-500 rounded"
            />
            <span className="text-sm text-gray-700">Cho phép bán</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
              className="w-4 h-4 text-red-500 rounded"
            />
            <span className="text-sm text-gray-700">Nổi bật</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(event) => setForm((prev) => ({ ...prev, isNew: event.target.checked }))}
              className="w-4 h-4 text-red-500 rounded"
            />
            <span className="text-sm text-gray-700">Mới</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh sách media</label>

            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleUploadMedia}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <Button type="button" variant="outline" onClick={() => mediaInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Upload media
              </Button>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={mediaUrlInput}
                  onChange={(event) => setMediaUrlInput(event.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="Hoặc nhập URL media"
                />
                <Button type="button" variant="outline" onClick={handleAddMediaUrl}>Thêm</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.mediaList.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có media nào</p>
              ) : (
                form.mediaList.map((media, index) => {
                  const isVideo = isVideoMedia(media);
                  const youtubeEmbedUrl = toYouTubeEmbedUrl(media);
                  const isPrimaryImage = !isVideo && index === primaryMediaIndex;
                  return (
                    <div
                      key={`${index}-${media.slice(0, 20)}`}
                      className={`group p-3 rounded-xl border bg-gray-50 transition-colors ${isPrimaryImage ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isVideo ? 'bg-blue-100 text-blue-700' : (isPrimaryImage ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}`}>
                          {isVideo ? 'Video' : isPrimaryImage ? 'Ảnh chính' : 'Image'}
                        </span>
                        <div className="flex items-center gap-1">
                          {!isVideo && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                              title="Đặt làm ảnh chính"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingMediaIndex((prev) => (prev === index ? null : index))}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            title="Chỉnh sửa đường dẫn"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                            title="Xóa media"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-44 flex items-center justify-center">
                        {isVideo ? (
                          youtubeEmbedUrl ? (
                            <iframe
                              src={youtubeEmbedUrl}
                              title={`Media preview ${index + 1}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video src={media} controls className="w-full h-full object-contain bg-black" />
                          )
                        ) : (
                          <img
                            src={media}
                            alt={`Media preview ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      {editingMediaIndex === index && (
                        <input
                          type="text"
                          value={media}
                          onChange={(event) => updateMedia(index, event.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Biến thể sản phẩm</h3>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addVariant}>
              <Plus className="w-4 h-4 mr-1" /> Thêm biến thể
            </Button>
            <Button type="button" onClick={generateVariantsFromAttributes}>
              Tạo biến thể
            </Button>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-3 md:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Thuộc tính biến thể</p>
            <Button type="button" variant="outline" onClick={addAttribute}>
              <Plus className="w-4 h-4 mr-1" /> Thêm thuộc tính
            </Button>
          </div>

          <div className="space-y-3">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Tên thuộc tính"
                  value={attribute.name}
                  onChange={(event) => updateAttributeName(attribute.id, event.target.value)}
                  placeholder="VD: Kích cỡ"
                />
                <div className="flex items-end gap-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá trị</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={attribute.draftValue}
                        onChange={(event) => updateAttributeDraftValue(attribute.id, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addAttributeValue(attribute.id);
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        placeholder="Nhập giá trị (VD: M)"
                      />
                      <Button type="button" variant="outline" onClick={() => addAttributeValue(attribute.id)}>
                        Thêm
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attribute.values.length === 0 ? (
                        <span className="text-xs text-gray-400">Chưa có giá trị</span>
                      ) : (
                        attribute.values.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => removeAttributeValue(attribute.id, value)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-red-50 hover:text-red-600"
                            title="Xóa giá trị"
                          >
                            {value}
                            <X className="w-3 h-3" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttribute(attribute.id)}
                    className="p-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                    title="Xóa thuộc tính"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="space-y-3">
          {form.variants.map((variant, index) => (
            <div key={variant.id} className="border border-gray-100 rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Biến thể {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  disabled={form.variants.length === 1}
                  title="Xóa biến thể"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  label="Tên biến thể *"
                  value={variant.name}
                  onChange={(event) => updateVariant(variant.id, 'name', event.target.value)}
                  placeholder="VD: Size L"
                />
                <Input
                  label="Giá gốc *"
                  type="number"
                  value={String(variant.originalPrice)}
                  onChange={(event) => updateVariant(variant.id, 'originalPrice', event.target.value)}
                />
                <Input
                  label="Giá bán *"
                  type="number"
                  value={String(variant.salePrice)}
                  onChange={(event) => updateVariant(variant.id, 'salePrice', event.target.value)}
                />
                <Input
                  label="Số lượng *"
                  type="number"
                  value={String(variant.quantity)}
                  onChange={(event) => updateVariant(variant.id, 'quantity', event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/admin/products')} disabled={saving}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="w-4 h-4 mr-1" />
          {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </Button>
      </div>
    </div>
  );
}
