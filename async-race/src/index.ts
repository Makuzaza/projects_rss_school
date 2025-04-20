import { baseUrl } from "./components/garage/api_garage";
import "./styles.css";
import "./components/garage/api_garage";
import "./components/garage/utils_garage";
import "./components/garage/buttons_garage";
import "./components/ui";
import "./components/garage/drive_car";
import "./components/winners/api_winners";
import "./components/winners/buttons_winners";

async function initializeApp() {
  try {
    await fetch(baseUrl, { method: "HEAD" });
    // Server is available, proceed with app initialization
  } catch (error) {
    console.error("Server is unavailable. Please try again later.");
  }
}

initializeApp();
