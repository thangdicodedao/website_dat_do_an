import { Truck, Clock, MapPin, Phone } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chính sách vận chuyển</h1>
          <p className="text-gray-600">Thông tin về giao hàng và vận chuyển</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Thời gian giao hàng
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi cam kết giao hàng trong thời gian sớm nhất có thể:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Khu vực nội thành: 30-45 phút kể từ khi xác nhận đơn hàng</li>
                <li>Khu vực ngoại thành (trong phạm vi 10km): 45-60 phút</li>
                <li>Khu vực xa hơn: Thời gian sẽ được thông báo khi đặt hàng</li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                * Thời gian có thể thay đổi vào giờ cao điểm hoặc điều kiện thời tiết
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Khu vực giao hàng
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi giao hàng đến các khu vực sau:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Toàn bộ các quận nội thành Hà Nội</li>
                <li>Các huyện lân cận trong phạm vi 15km</li>
                <li>Các khu vực khác: Liên hệ để xác nhận</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-500" />
              Phí vận chuyển
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Phí vận chuyển được tính như sau:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 pr-4 font-semibold">Khu vực</th>
                      <th className="py-2 pr-4 font-semibold">Phí ship</th>
                      <th className="py-2 font-semibold">Đơn hàng miễn phí</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">Nội thành</td>
                      <td className="py-2 pr-4">15.000đ</td>
                      <td className="py-2">Trên 200.000đ</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">Ngoại thành (trong 10km)</td>
                      <td className="py-2 pr-4">25.000đ</td>
                      <td className="py-2">Trên 300.000đ</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Xa hơn 10km</td>
                      <td className="py-2 pr-4">35.000đ+</td>
                      <td className="py-2">Trên 500.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lưu ý quan trọng</h2>
            <div className="text-gray-600 space-y-2">
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Đơn hàng sẽ được xác nhận qua điện thoại trước khi giao</li>
                <li>Nếu không liên lạc được, đơn hàng sẽ bị hủy sau 2 lần gọi</li>
                <li>Khách hàng vui lòng kiểm tra hàng trước khi nhận</li>
                <li>Phí ship có thể thay đổi vào ngày lễ, Tết</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-red-50 rounded-xl p-4 flex items-center gap-4">
              <Phone className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Cần hỗ trợ?</p>
                <p className="text-sm text-gray-600">Gọi hotline: 0335547876</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
