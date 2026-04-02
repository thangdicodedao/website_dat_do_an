const { query } = require('../config/database');

const toAddress = (row) => {
  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: row.name,
    phone: row.phone,
    address: row.address,
    city: row.city || '',
    district: row.district || '',
    ward: row.ward || '',
    label: row.label || 'Nhà riêng',
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const Address = {
  async findById(id) {
    const [rows] = await query('SELECT * FROM addresses WHERE id = ?', [id]);
    return toAddress(rows[0]);
  },

  async findByIdAndUser(id, userId) {
    const [rows] = await query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    return rows[0] || null;
  },

  async findByUser(userId) {
    const [rows] = await query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows.map(toAddress);
  },

  async create({ userId, name, phone, address, city, district, ward, label, isDefault }) {
    // If this is the first address or isDefault, clear other defaults
    if (isDefault) {
      await query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    } else {
      const [count] = await query('SELECT COUNT(*) as total FROM addresses WHERE user_id = ?', [userId]);
      if (count[0].total === 0) isDefault = true;
    }

    const [result] = await query(
      `INSERT INTO addresses (user_id, name, phone, address, city, district, ward, label, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, phone, address, city || '', district || '', ward || '', label || 'Nhà riêng', isDefault ? 1 : 0]
    );
    return this.findById(result.insertId);
  },

  async update(id, userId, fields) {
    const address = await this.findByIdAndUser(id, userId);
    if (!address) return null;

    // If setting as default, clear others
    if (fields.isDefault && !address.isDefault) {
      await query('UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id <> ?', [userId, id]);
    }

    const allowed = ['name', 'phone', 'address', 'city', 'district', 'ward', 'label', 'is_default'];
    const updates = [];
    const values = [];

    for (const key of Object.keys(fields)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowed.includes(dbKey)) {
        if (key === 'isDefault') {
          updates.push('is_default = ?');
          values.push(fields[key] ? 1 : 0);
        } else {
          updates.push(`${dbKey} = ?`);
          values.push(fields[key]);
        }
      }
    }

    if (updates.length === 0) return toAddress(address);

    values.push(id, userId);
    await query(`UPDATE addresses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, values);
    return this.findById(id);
  },

  async delete(id, userId) {
    const address = await this.findByIdAndUser(id, userId);
    await query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);

    // If deleted address was default, set the first remaining as default
    if (address && address.isDefault) {
      const [next] = await query(
        'SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      if (next[0]) {
        await query('UPDATE addresses SET is_default = 1 WHERE id = ?', [next[0].id]);
      }
    }
  },

  async setDefault(id, userId) {
    await query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    await query('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    return this.findById(id);
  },
};

module.exports = Address;
