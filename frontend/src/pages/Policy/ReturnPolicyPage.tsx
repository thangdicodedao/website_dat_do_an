import { RefreshCw, Clock, AlertCircle, Phone } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chính sách đổi trả</h1>
          <p className="text-gray-600">Chính sách đổi trả sản phẩm</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Thời gian đổi trả
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi chấp nhận đổi trả trong các trường hợp sau:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Đổi trả trong vòng <strong>24 giờ</strong> kể từ khi nhận hàng đối với sản phẩm lỗi</li>
                <li>Đổi size/món ăn trong vòng <strong>2 giờ</strong> kể từ khi nhận hàng (nếu còn hàng)</li>
                <li>Không chấp nhận đổi trả đối với đơn hàng đã sử dụng một phần</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Điều kiện đổi trả
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Sản phẩm được chấp nhận đổi trả khi:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Sản phẩm còn nguyên vẹn, không bị hư hỏng</li>
                <li>Còn đầy đủ bao bì, nhãn mác như ban đầu</li>
                <li>Có hóa đơn mua hàng hoặc mã đơn hàng</li>
                <li>Sản phẩm bị lỗi từ nhà sản xuất</li>
                <li>Giao nhầm món ăn hoặc sản phẩm không đúng như đơn đặt</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Các trường hợp không được đổi trả</h2>
            <div className="text-gray-600 space-y-2">
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Sản phẩm đã được sử dụng hoặc tiêu thụ một phần</li>
                <li>Sản phẩm bị hư hỏng do lỗi của khách hàng</li>
                <li>Khách hàng đổi ý sau khi đặt hàng (trừ khi có thỏa thuận khác)</li>
                <li>Sản phẩm khuyến mãi, giảm giá sâu</li>
                <li>Đơn hàng giao sai do khách hàng cung cấp thông tin sai</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quy trình đổi trả</h2>
            <div className="text-gray-600 space-y-3">
              <p>Để yêu cầu đổi trả, vui lòng thực hiện các bước sau:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Liên hệ hotline <strong>0335547876</strong> hoặc qua fanpage để thông báo</li>
                <li>Cung cấp mã đơn hàng và lý do đổi trả</li>
                <li>Chụp ảnh sản phẩm gửi cho chúng tôi (nếu có)</li>
                <li>Chờ xác nhận từ nhân viên trong vòng 24 giờ</li>
                <li>Mang sản phẩm đến cửa hàng hoặc chờ nhân viên đến lấy (nếu áp dụng)</li>
              </ol>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hoàn tiền</h2>
            <div className="text-gray-600 space-y-3">
              <p>Sau khi xác nhận đổi trả, chúng tôi sẽ:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Hoàn tiền vào tài khoản VNPAY trong vòng 3-5 ngày làm việc</li>
                <li>Hoàn tiền mặt tại cửa hàng ngay sau khi xác nhận</li>
                <li>Đổi sang sản phẩm khác có giá trị tương đương hoặc chênh lệch</li>
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
