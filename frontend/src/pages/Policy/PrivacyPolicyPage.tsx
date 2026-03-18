import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chính sách bảo mật</h1>
          <p className="text-gray-600">Cam kết bảo vệ thông tin cá nhân của bạn</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-red-500" />
              1. Thu thập thông tin
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi thu thập các thông tin sau:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Thông tin cá nhân:</strong> Họ tên, số điện thoại, email, địa chỉ giao hàng</li>
                <li><strong>Thông tin thanh toán:</strong> Phương thức thanh toán (không lưu thông tin thẻ)</li>
                <li><strong>Thông tin sử dụng:</strong> Lịch sử đặt hàng, sở thích món ăn</li>
                <li><strong>Dữ liệu thiết bị:</strong> Địa chỉ IP, loại thiết bị, trình duyệt</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              2. Mục đích sử dụng
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Thông tin thu thập được sử dụng để:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Xử lý đơn hàng và giao hàng</li>
                <li>Liên hệ xác nhận đơn hàng và giao hàng</li>
                <li>Cung cấp hỗ trợ khách hàng</li>
                <li>Gửi thông tin khuyến mãi, ưu đãi (nếu đồng ý)</li>
                <li>Cải thiện chất lượng dịch vụ</li>
                <li>Thực hiện các thống kê phân tích</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              3. Bảo mật thông tin
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi cam kết bảo vệ thông tin của bạn bằng:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Sử dụng công nghệ mã hóa SSL/TLS cho giao dịch</li>
                <li>Lưu trữ dữ liệu trên máy chủ bảo mật</li>
                <li>Hạn chế quyền truy cập thông tin cho nhân viên</li>
                <li>Thường xuyên cập nhật hệ thống bảo mật</li>
                <li>Không chia sẻ thông tin cá nhân với bên thứ ba (trừ đối tác giao hàng)</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-500" />
              4. Quyền của người dùng
            </h2>
            <div className="text-gray-600 space-y-3">
              <p>Bạn có các quyền sau đối với thông tin cá nhân:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Quyền truy cập:</strong> Xem và lấy bản sao thông tin cá nhân</li>
                <li><strong>Quyền sửa:</strong> Yêu cầu sửa thông tin không chính xác</li>
                <li><strong>Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân</li>
                <li><strong>Quyền từ chối:</strong> Từ chốc nhận email marketing</li>
                <li><strong>Quyền khiếu nại:</strong> Khiếu nại về cách xử lý dữ liệu</li>
              </ul>
              <p className="mt-2">Để thực hiện các quyền trên, vui lòng liên hệ qua email hoặc hotline.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies và Công nghệ theo dõi</h2>
            <div className="text-gray-600 space-y-3">
              <p>Chúng tôi sử dụng cookies để:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Ghi nhớ đăng nhập và cài đặt người dùng</li>
                <li>Phân tích lưu lượng truy cập</li>
                <li>Cá nhân hóa nội dung và quảng cáo</li>
              </ul>
              <p className="mt-2">Bạn có thể tắt cookies trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của website.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Liên kết bên thứ ba</h2>
            <div className="text-gray-600 space-y-2">
              <p>Website có thể chứa liên kết đến các website bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các website này.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Thay đổi chính sách</h2>
            <div className="text-gray-600 space-y-2">
              <p>Chúng tôi có thể cập nhật chính sách bảo mật này vào bất kỳ lúc nào. Mọi thay đổi sẽ được đăng tải trên trang này.</p>
              <p className="text-sm text-gray-500 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </section>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-red-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">Liên hệ về bảo mật</p>
              <p className="text-sm text-gray-600">
                Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ: <strong>dsbqnqx@gmail.com</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
