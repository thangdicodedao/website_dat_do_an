import api from '../api';
import { Address } from '../../types';

export const addressAPI = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data.data.addresses;
  },

  createAddress: async (data: Omit<Address, 'id' | 'userId'>): Promise<Address> => {
    const response = await api.post('/addresses', data);
    return response.data.data.address;
  },

  updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data.data.address;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data.data.address;
  },
};
