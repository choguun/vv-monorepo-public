import { useEffect, useState } from "react";

import { useInventoryCount } from "./useInventoryCount";

export function useInventoryCounts(inventoryItems) {
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    if (inventoryItems && inventoryItems.length > 0) {
      const inventoryCounts = inventoryItems.map((item) => {
        const { count } = useInventoryCount(item); // Replace with logic if not a Hook
        return { id: item, count };
      });
      setCounts(inventoryCounts);
    }
  }, [inventoryItems]);

  return counts;
}
