export const baseUrl = "http://localhost:3000";

const engine = `${baseUrl}/engine`;

export class EngineService {
  static async startEngine(id: number) {
      const response = await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' });
      return response.json();
  }

  static async stopEngine(id: number) {
      const response = await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' });
      return response.json();
  }

  static async driveEngine(id: number) {
      const res = await fetch(`${engine}?id=${id}&status=drive`, { method: 'PATCH' });
      return res.status !== 200 ? { success: false } : { ...(await res.json()) };
  }
}
