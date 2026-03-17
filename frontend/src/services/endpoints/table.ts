import { mockApi } from '../api';
import { Table } from '../../types';
import { tables } from '../../data';

export const tableAPI = {
  getTables: async (): Promise<Table[]> => {
    await mockApi.delay(400);
    return tables;
  },

  getTableById: async (id: string): Promise<Table> => {
    await mockApi.delay(300);

    const table = tables.find(t => t.id === id);
    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    return table;
  },

  getTableByQrCode: async (qrCode: string): Promise<Table> => {
    await mockApi.delay(400);

    const table = tables.find(t => t.qrCode === qrCode);
    if (!table) {
      throw new Error('Mã QR không hợp lệ');
    }

    return table;
  },

  getAvailableTables: async (): Promise<Table[]> => {
    await mockApi.delay(300);
    return tables.filter(t => t.status === 'available');
  },

  updateTableStatus: async (id: string, status: Table['status']): Promise<Table> => {
    await mockApi.delay(400);

    const table = tables.find(t => t.id === id);
    if (!table) {
      throw new Error('Bàn không tồn tại');
    }

    table.status = status;
    return table;
  },

  getTablesByLocation: async (location: string): Promise<Table[]> => {
    await mockApi.delay(300);
    return tables.filter(t => t.location === location);
  },
};
