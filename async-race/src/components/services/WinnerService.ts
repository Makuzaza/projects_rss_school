import { baseUrl } from './EngineService';

const winners = `${baseUrl}/winners`;

export class WinnerService {
  static countAllWinners = 0;

  static async getAllWinners() {
    const response = await fetch(`${winners}`, { method: 'GET' });
    return response.json();
  }

  static async getWinners(page: number, limit = 10, sort: string = '', order: 'asc' | 'desc' = 'asc') {
    const url = new URL(`${winners}?_page=${page}&_limit=${limit}`, window.location.origin);
    if (sort) {
      url.searchParams.append('_sort', sort);
      url.searchParams.append('_order', order);
    }
    const response = await fetch(url.toString(), { method: 'GET' });
    this.countAllWinners = Number(response.headers.get('X-Total-count'));
    return response.json();
  }

  static async getWinner(id: number) {
    const response = await fetch(`${winners}/${id}`, { method: 'GET' });
    return response.json();
  }

  static async createWinner(body: object) {
    await fetch(winners, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static async deleteWinner(id: number) {
    await fetch(`${winners}/${id}`, { method: 'DELETE' });
  }

  static async updateWinner(body: object, id: number) {
    await fetch(`${winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
