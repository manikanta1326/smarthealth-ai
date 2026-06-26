import { useContext } from "react";
import HealthContext from "../context/HealthContext";

export const useHealth = () => useContext(HealthContext);