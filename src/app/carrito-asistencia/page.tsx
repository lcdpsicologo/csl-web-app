import type { Metadata } from "next";
import { AttendanceCartApp } from "@/components/carrito-asistencia/AttendanceCartApp";

export const metadata: Metadata = {
  title: "Carrito de la Asistencia | Tiza Education",
  description: "Entrega de Golden Tickets, canje de premios y control de inventario para Prekínder, Kínder y 1° Básico.",
};

export default function AttendanceCartPage() {
  return <AttendanceCartApp />;
}
