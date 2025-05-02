import { baseUrl } from "../src/components/services/EngineService";
import "./styles.css";
import "./components/garage/utilsGarage";
import "./components/garage/buttonsGarage";
import "./components/ui";
import "./components/garage/driveCar";
import "./components/winners/buttonsWinners";

async function initializeApp() {
    await fetch(baseUrl, { method: "HEAD" });
}

initializeApp();
