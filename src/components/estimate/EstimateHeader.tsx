import React from "react";
import { Button } from "@/components/ui/button";

export function EstimateHeader({
  grandTotal,
  onExpandAll,
  onCollapseAll,
}: {
  grandTotal: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container py-4 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Estimate</h1>
          <p className="text-sm text-muted-foreground">Inline editable quantities and unit costs with instant totals.</p>
        </div>
        <div className="flex items-end gap-6">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Grand Total</div>
            <div className="text-3xl font-bold">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(grandTotal)}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExpandAll} aria-label="Expand all sections">Expand all</Button>
            <Button variant="ghost" onClick={onCollapseAll} aria-label="Collapse all sections">Collapse all</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
