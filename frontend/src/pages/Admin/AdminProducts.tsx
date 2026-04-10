import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { Button, Modal, ProductListSkeleton } from '../../components/common';
import { productAPI } from '../../services';
import { Product } from '../../types';
import { formatPrice } from '../../utils';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productAPI.getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setSubmitting(true);
    try {
      await productAPI.deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((item) => item.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Xóa sản phẩm thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  if (loading) return <ProductListSkeleton count={8} />;

  return (
    <>
      <div className="flex justify-end mb-4 md:mb-6">
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/products/new')}
          disabled={submitting}
        >
          <Plus className="w-4 h-4 mr-1" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-100">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 border-y border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Giá gốc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Giá bán</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Số lượng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Biến thể</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap bg-gray-50 sticky right-0 z-10">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const variants = product.variants || [];
                  const totalQuantity = variants.reduce((sum, variant) => sum + variant.quantity, 0);
                  const salePrices = variants.map((variant) => variant.salePrice);
                  const originalPrices = variants.map((variant) => variant.originalPrice);
                  const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : product.price;
                  const maxOriginalPrice = originalPrices.length > 0 ? Math.max(...originalPrices) : (product.originalPrice ?? product.price);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.preparationTime} phút</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{formatPrice(maxOriginalPrice)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 text-sm">{formatPrice(minSalePrice)}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{totalQuantity}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{variants.length}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{product.categoryName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="px-4 py-3 bg-white sticky right-0 z-10">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem"
                            disabled={submitting}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sửa"
                            disabled={submitting}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                            disabled={submitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        title="Chi tiết sản phẩm"
        size="xl"
      >
        {viewingProduct && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={viewingProduct.images[0]}
                alt={viewingProduct.name}
                className="w-24 h-24 rounded-xl object-cover border border-gray-100"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewingProduct.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{viewingProduct.categoryName}</p>
                <p className="text-sm text-gray-600 mt-2">{viewingProduct.description}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-y border-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Biến thể</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Giá gốc</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(viewingProduct.variants || []).map((variant) => (
                    <tr key={variant.id}>
                      <td className="px-3 py-2 text-sm text-gray-700">{variant.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{formatPrice(variant.originalPrice)}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{formatPrice(variant.salePrice)}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{variant.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(deletingProduct)}
        onClose={() => {
          if (!submitting) {
            setDeletingProduct(null);
          }
        }}
        title="Xóa sản phẩm"
        size="sm"
      >
        {deletingProduct && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Bạn có chắc muốn xóa sản phẩm <span className="font-semibold text-gray-900">{deletingProduct.name}</span>?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingProduct(null)}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button className="flex-1" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
