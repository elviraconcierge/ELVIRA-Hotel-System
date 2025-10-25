import { useMemo, useCallback } from "react";
import {
  ModalFormSection,
  ModalFormField,
  StatusBadge,
} from "../../../../../../components/ui";
import { useUpdateShopOrderStatus } from "../../../../../../hooks/hotel-shop";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface OrderInfoSectionProps {
  order: ShopOrderWithDetails;
}

export function OrderInfoSection({ order }: OrderInfoSectionProps) {
  const updateStatus = useUpdateShopOrderStatus();

  // Status options for shop orders (memoized)
  const orderStatusOptions = useMemo(
    () => [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "completed",
      "cancelled",
    ],
    []
  );

  // Handle status change (wrapped in useCallback)
  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      try {
        await updateStatus.mutateAsync({
          id: order.id,
          status: newStatus,
        });
      } catch (error) {
        console.error("Failed to update shop order status:", error);
      }
    },
    [updateStatus, order.id]
  );

  return (
    <ModalFormSection title="Order Information">
      <div className="grid grid-cols-2 gap-4">
        <ModalFormField
          label="Order ID"
          value={order.id.substring(0, 8).toUpperCase()}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">Status</span>
          <StatusBadge
            status={order.status}
            statusOptions={orderStatusOptions}
            onStatusChange={handleStatusChange}
          />
        </div>
        <ModalFormField
          label="Guest"
          value={order.guests?.guest_name || "N/A"}
        />
        <ModalFormField
          label="Room"
          value={order.guests?.room_number || "N/A"}
        />
        <ModalFormField
          label="Total Price"
          value={`$${order.total_price?.toFixed(2) || "0.00"}`}
        />
        <ModalFormField
          label="Created At"
          value={
            order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "N/A"
          }
        />
      </div>
    </ModalFormSection>
  );
}
