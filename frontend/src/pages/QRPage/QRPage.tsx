import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { QrCode, MapPin, Users, ArrowRight, ShoppingCart } from 'lucide-react';
import { ProductCard } from '../../components/features';
import { Button, ProductListSkeleton } from '../../components/common';
import { useAppSelector } from '../../hooks';
import { tableAPI, productAPI } from '../../services';
import { Table, Product } from '../../types';

export default function QRPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get('qr');
  const { items } = useAppSelector((state) => state.cart);

  const [table, setTable] = useState<Table | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let tableData: Table | undefined;

        if (tableId) {
          tableData = await tableAPI.getTableById(tableId);
        } else if (qrCode) {
          tableData = await tableAPI.getTableByQrCode(qrCode);
        }

        if (!tableData) {
          setError('Không tìm thấy thông tin bàn');
          return;
        }

        setTable(tableData);

        // Fetch products
        const productsData = await productAPI.getProducts();
        setProducts(productsData.products.slice(0, 8));
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableId, qrCode]);

  if (loading) {
    return <ProductListSkeleton count={6} />;
  }

  if (error || !table) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm max-w-md">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bàn</h2>
          <p className="text-gray-500 mb-6">{error || 'Mã QR không hợp lệ'}</p>
          <Link to="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Quán ăn Bình Bún Bò</h1>
              <div className="flex items-center gap-4 mt-2 text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {table.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Bàn {table.number} - {table.capacity} người
                </span>
              </div>
            </div>
            <Link
              to="/cart"
              className="relative p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Menu đặt món</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* More Products Link */}
        <div className="text-center mt-8">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Xem tất cả món
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
