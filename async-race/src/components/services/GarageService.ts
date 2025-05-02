import { Modal } from '../garage/modal';
import { baseUrl } from './EngineService';

const garage = `${baseUrl}/garage`;

export class GarageService {
  static countAllCars = 0;

  static async checkServer() {
        try {
          const response = await fetch(baseUrl, { method: "HEAD" });
          if (!response.ok) {
            Modal.show();
            throw new Error("Server not available");
          }
        } catch (error) {
          Modal.show();
        }
  }

  static async getCars(page: number, limit = 7) {
      await this.checkServer();
      const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`, { method: 'GET' });
      this.countAllCars = Number(response.headers.get('X-Total-count'));
      return response.json();
  }

  static async getCar(id: number) {
      await this.checkServer();
      const response = await fetch(`${garage}/${id}`, { method: 'GET' });
      return response.json();
  }

  static async createCar(body: object) {
      await this.checkServer();
      await fetch(garage, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
  }

  static async deleteCar(id: number) {
      await this.checkServer();
      await fetch(`${garage}/${id}`, { method: 'DELETE' });
  }

  static async updateCar(body: object, id: number) {
      await this.checkServer();
      await fetch(`${garage}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
  }
}
