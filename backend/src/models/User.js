const { query } = require('../config/database');

// Helper: convert MySQL row to API response shape
const toUser = (row) => {
  if (!row) return null;
  return {
    id: String(row.id),
    email: row.email,
    name: row.name,
    phone: row.phone || '',
    avatar: row.avatar || null,
    role: String(row.role || 'user').toLowerCase(),
    isVerified: Boolean(row.is_verified),
    address: row.address || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const User = {
  async findById(id) {
    const [rows] = await query('SELECT * FROM users WHERE id = ?', [id]);
    return toUser(rows[0]);
  },

  async findByEmail(email) {
    const [rows] = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return toUser(rows[0]);
  },

  async findByIdWithPassword(id) {
    const [rows] = await query('SELECT id, email, name, phone, avatar, role, is_verified, address, password, created_at, updated_at FROM users WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return { ...toUser(rows[0]), _password: rows[0].password };
  },

  async findByIdWithRefreshToken(id) {
    const [rows] = await query('SELECT id, email, refresh_token FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmailWithPassword(email) {
    const [rows] = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return rows[0] || null;
  },

  async findByEmailWithCode(email, code) {
    const [rows] = await query(
      'SELECT * FROM users WHERE email = ? AND verification_code = ? AND verification_code_expires > NOW()',
      [email.toLowerCase(), code]
    );
    return rows[0] || null;
  },

  async create({ email, password, name, phone, verificationCode, verificationCodeExpires }) {
    const [result] = await query(
      `INSERT INTO users (email, password, name, phone, verification_code, verification_code_expires)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email.toLowerCase(), password, name, phone, verificationCode, verificationCodeExpires]
    );
    return this.findById(result.insertId);
  },

  async updateRefreshToken(id, refreshToken) {
    await query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
  },

  async clearRefreshToken(id) {
    await query('UPDATE users SET refresh_token = NULL WHERE id = ?', [id]);
  },

  async updateVerification(id) {
    await query(
      'UPDATE users SET is_verified = 1, verification_code = NULL, verification_code_expires = NULL WHERE id = ?',
      [id]
    );
  },

  async setResetCode(id, code, expires) {
    await query('UPDATE users SET reset_password_code = ?, reset_password_expires = ? WHERE id = ?', [code, expires, id]);
  },

  async setVerificationCode(id, code, expires) {
    await query('UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE id = ?', [code, expires, id]);
  },

  async findByResetCode(email, code) {
    const [rows] = await query(
      'SELECT * FROM users WHERE email = ? AND reset_password_code = ? AND reset_password_expires > NOW()',
      [email.toLowerCase(), code]
    );
    return rows[0] || null;
  },

  async updatePasswordAndClearReset(id, hashedPassword) {
    await query(
      'UPDATE users SET password = ?, reset_password_code = NULL, reset_password_expires = NULL, refresh_token = NULL WHERE id = ?',
      [hashedPassword, id]
    );
  },

  async updatePasswordAndClearRefresh(id, hashedPassword) {
    await query('UPDATE users SET password = ?, refresh_token = NULL WHERE id = ?', [hashedPassword, id]);
  },

  async findAll({ search = '', page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM users';
    let countSql = 'SELECT COUNT(*) as total FROM users';
    const params = [];

    if (search) {
      const where = ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
      const s = `%${search}%`;
      sql += where;
      countSql += where;
      params.push(s, s, s);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const [rows] = await query(countSql, params);
    const total = rows[0].total;

    const [users] = await query(sql, [...params, String(limit), String(offset)]);
    return {
      users: users.map(toUser),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async update(id, fields) {
    const allowed = ['name', 'phone', 'avatar', 'role', 'is_verified', 'address'];
    const updates = [];
    const values = [];

    for (const key of Object.keys(fields)) {
      if (fields[key] === undefined) {
        continue;
      }

      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowed.includes(dbKey)) {
        if (key === 'isVerified') {
          updates.push('is_verified = ?');
          values.push(fields[key] ? 1 : 0);
        } else {
          updates.push(`${dbKey} = ?`);
          values.push(fields[key]);
        }
      }
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id) {
    await query('DELETE FROM users WHERE id = ?', [id]);
  },

  async countAll() {
    const [rows] = await query('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  },

  async countNewToday() {
    const [rows] = await query('SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()');
    return rows[0].total;
  },
};

module.exports = User;
