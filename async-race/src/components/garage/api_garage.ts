import { Modal } from "./modal";
export const baseUrl = "http://localhost:3000";

const garage = `${baseUrl}/garage`;
const motor = `${baseUrl}/engine`;

export let countAllCars = 0;

// Helper function to check server availability
async function checkServer() {
  try {
    const response = await fetch(baseUrl, { method: "HEAD" });
    if (!response.ok) {
      Modal.show();
      throw new Error("Server not available");
    }
  } catch (error) {
    Modal.show();
    throw error;
  }
}

// API functions with error handling
export const getCarsAPI = async (page: number, limit = 7) => {
  try {
    await checkServer();
    const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`, {
      method: "GET",
    });
    countAllCars = Number(response.headers.get("X-Total-count"));
    return response.json();
  } catch (error) {
    console.error("Failed to fetch cars:", error);
    throw error;
  }
};

export const getCarAPI = async (id: number) => {
  try {
    await checkServer();
    const response = await fetch(`${garage}/${id}`, { method: "GET" });
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch car ${id}:`, error);
    throw error;
  }
};

export const createCarAPI = async (body: object) => {
  try {
    await checkServer();
    await fetch(garage, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to create car:", error);
    throw error;
  }
};

export const deleteCarAPI = async (id: number) => {
  try {
    await checkServer();
    await fetch(`${garage}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete car ${id}:`, error);
    throw error;
  }
};

export const updateCarAPI = async (body: object, id: number) => {
  try {
    await checkServer();
    await fetch(`${garage}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Failed to update car ${id}:`, error);
    throw error;
  }
};

export const startMotorAPI = async (id: number) => {
  try {
    await checkServer();
    const response = await fetch(`${motor}?id=${id}&status=started`, {
      method: "PATCH",
    });
    return response.json();
  } catch (error) {
    console.error(`Failed to start motor ${id}:`, error);
    throw error;
  }
};

export const stopMotorAPI = async (id: number) => {
  try {
    await checkServer();
    const response = await fetch(`${motor}?id=${id}&status=stopped`, {
      method: "PATCH",
    });
    return response.json();
  } catch (error) {
    console.error(`Failed to stop motor ${id}:`, error);
    throw error;
  }
};

export const driveMotorAPI = async (id: number) => {
  try {
    await checkServer();
    const res = await fetch(`${motor}?id=${id}&status=drive`, {
      method: "PATCH",
    });
    return res.status !== 200 ? { success: false } : { ...(await res.json()) };
  } catch (error) {
    console.error(`Failed to drive motor ${id}:`, error);
    return { success: false };
  }
};
