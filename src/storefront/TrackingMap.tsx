import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Order, StoreWithMetrics } from '../types/store';
import { useShipmentSimulation } from './useShipmentSimulation';
import './TrackingMap.css';

interface TrackingMapProps {
  order: Order;
  store: StoreWithMetrics;
  updateOrder: (o: Order) => void;
}

const pin = (emoji: string) =>
  divIcon({ html: `<span class="tracking-pin">${emoji}</span>`, className: 'tracking-icon', iconSize: [30, 30], iconAnchor: [15, 15] });

const warehouseIcon = pin('🏪');
const clientIcon = pin('📍');
const courierIcon = pin('🛵');

export function TrackingMap({ order, store, updateOrder }: TrackingMapProps) {
  useShipmentSimulation(order, updateOrder);

  const warehouse: [number, number] = [store.lat, store.lng];
  const delivery: [number, number] = [order.deliveryLat ?? store.lat, order.deliveryLng ?? store.lng];
  const courier: [number, number] = [order.currentLat ?? store.lat, order.currentLng ?? store.lng];

  const center: [number, number] = [(warehouse[0] + delivery[0]) / 2, (warehouse[1] + delivery[1]) / 2];
  const statusLabel =
    order.status === 'DELIVERED'
      ? 'Entregado'
      : order.status === 'SHIPPED'
        ? `En camino · ${order.etaMinutes ?? '–'} min`
        : 'Aún no despachado';

  return (
    <div className="tracking-map__wrap">
      <div className="tracking-map__status">
        <strong>{statusLabel}</strong>
        {order.courierName && <span> · {order.courierName}</span>}
      </div>
      <MapContainer center={center} zoom={13} className="tracking-map" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={[warehouse, delivery]} pathOptions={{ color: '#ea580c', dashArray: '6 6' }} />
        <Marker position={warehouse} icon={warehouseIcon}>
          <Popup>Almacén {store.name}</Popup>
        </Marker>
        <Marker position={delivery} icon={clientIcon}>
          <Popup>Dirección de entrega</Popup>
        </Marker>
        {order.status === 'SHIPPED' && (
          <Marker position={courier} icon={courierIcon}>
            <Popup>{order.courierName ?? 'Repartidor'} en camino</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
