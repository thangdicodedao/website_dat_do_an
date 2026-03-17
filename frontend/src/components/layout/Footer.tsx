import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Bếp Việt</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Nhà hàng thức ăn nhanh ngon nhất với các món ăn đa dạng và chất lượng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/products?category=mon-chinh" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Món chính
                </Link>
              </li>
              <li>
                <Link to="/products?category=mon-an-vat" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Đồ ăn vặt
                </Link>
              </li>
              <li>
                <Link to="/products?category=do-uong" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Đồ uống
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/return" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>123 Đường Nguyễn Trãi, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>contact@codedao.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bếp Việt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
