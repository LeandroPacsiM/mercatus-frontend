import { useEffect } from 'react';
import type { Order } from '../types/store';

const SPEED_KMH = 25;
const TRIP_MS = 25000;
const TICK_MS = 500;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useShipmentSimulation(order: Order | null, updateOrder: (o: Order) => void) {
  useEffect(() => {
    if (!order || order.fulfillmentType !== 'SHIPPING') return;
    if (order.status !== 'SHIPPED') return;
    if (order.deliveryLat == null || order.deliveryLng == null) return;

    const start = { lat: order.currentLat ?? order.deliveryLat, lng: order.currentLng ?? order.deliveryLng };
    const end = { lat: order.deliveryLat, lng: order.deliveryLng };
    const startTs = Date.now();

    if (!order.dispatchedAt) {
      updateOrder({ ...order, dispatchedAt: new Date().toISOString() });
    }

    const id = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - startTs) / TRIP_MS);
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      const remainingKm = haversineKm(lat, lng, end.lat, end.lng);
      const eta = Math.max(0, Math.round((remainingKm / SPEED_KMH) * 60));
      if (progress >= 1) {
        updateOrder({ ...order, currentLat: end.lat, currentLng: end.lng, etaMinutes: 0, status: 'DELIVERED' });
        window.clearInterval(id);
        return;
      }
      updateOrder({ ...order, currentLat: lat, currentLng: lng, etaMinutes: eta });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [order?.id, order?.status]);
}
