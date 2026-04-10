import { useState } from 'react';
import { Button } from '../../components/common';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Bình Bún Bò',
    supportEmail: 'support@binhbunbo.vn',
    supportPhone: '0909 000 111',
    timezone: 'Asia/Ho_Chi_Minh',
    orderAutoConfirmMinutes: 10,
    orderCancelAfterMinutes: 30,
    lowStockThreshold: 10,
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSmsNotifications: false,
    maintenanceMode: false,
    requireStrongPassword: true,
    enableTwoFactorForAdmin: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSaving(false);
    alert('Đã lưu cài đặt hệ thống');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Thông tin hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên cửa hàng</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(event) => setSettings((prev) => ({ ...prev, storeName: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Múi giờ hệ thống</label>
            <select
              value={settings.timezone}
              onChange={(event) => setSettings((prev) => ({ ...prev, timezone: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="Asia/Bangkok">Asia/Bangkok</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email hỗ trợ</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(event) => setSettings((prev) => ({ ...prev, supportEmail: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại hỗ trợ</label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(event) => setSettings((prev) => ({ ...prev, supportPhone: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Cài đặt đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tự xác nhận sau (phút)</label>
            <input
              type="number"
              value={settings.orderAutoConfirmMinutes}
              onChange={(event) => setSettings((prev) => ({ ...prev, orderAutoConfirmMinutes: Number(event.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tự hủy sau (phút)</label>
            <input
              type="number"
              value={settings.orderCancelAfterMinutes}
              onChange={(event) => setSettings((prev) => ({ ...prev, orderCancelAfterMinutes: Number(event.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngưỡng cảnh báo tồn kho</label>
            <input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(event) => setSettings((prev) => ({ ...prev, lowStockThreshold: Number(event.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Thông báo & bảo mật</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'enableEmailNotifications', label: 'Bật thông báo Email' },
            { key: 'enablePushNotifications', label: 'Bật thông báo Push' },
            { key: 'enableSmsNotifications', label: 'Bật thông báo SMS' },
            { key: 'requireStrongPassword', label: 'Yêu cầu mật khẩu mạnh' },
            { key: 'enableTwoFactorForAdmin', label: 'Bật 2FA cho admin' },
            { key: 'maintenanceMode', label: 'Chế độ bảo trì hệ thống' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    [item.key]: event.target.checked,
                  }))
                }
                className="w-4 h-4 text-red-500 rounded"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>
    </div>
  );
}
