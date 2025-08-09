import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import type { UIItem } from "./types";

export function ItemRow({
  sectionId,
  item,
  currency,
  updateQty,
  updateUnitCost,
}: {
  sectionId: string;
  item: UIItem;
  currency: Intl.NumberFormat;
  updateQty: (sectionId: string, itemId: string, qty: number) => void;
  updateUnitCost: (sectionId: string, itemId: string, unitCost: number) => void;
}) {
  const itemTotal = Number(item.qty || 0) * Number(item.unitCost || 0);

  return (
    <TableRow className="odd:bg-muted/30 hover:bg-muted/50">
      <TableCell className="font-mono text-xs">{item.type}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Input
          aria-label={`Quantity for ${item.name}`}
          inputMode="numeric"
          type="number"
          className="h-9 text-right"
          value={Number.isFinite(item.qty) ? item.qty : 0}
          onChange={(e) => updateQty(sectionId, item.id, Number(e.target.value))}
          onKeyUp={(e) => updateQty(sectionId, item.id, Number((e.target as HTMLInputElement).value))}
          min={0}
          step={1}
        />
      </TableCell>
      <TableCell className="text-right">
        <Input
          aria-label={`Unit cost for ${item.name}`}
          inputMode="decimal"
          type="number"
          className="h-9 text-right"
          value={Number.isFinite(item.unitCost) ? item.unitCost : 0}
          onChange={(e) => updateUnitCost(sectionId, item.id, Number(e.target.value))}
          onKeyUp={(e) => updateUnitCost(sectionId, item.id, Number((e.target as HTMLInputElement).value))}
          min={0}
          step={0.01}
        />
      </TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell className="text-right">{currency.format(itemTotal)}</TableCell>
      <TableCell className="text-center">
        {item.tax ? (
          <Badge variant="secondary">Tax</Badge>
        ) : (
          <span aria-hidden>—</span>
        )}
      </TableCell>
      <TableCell className="truncate" title={item.costCode}>
        {item.costCode ? <Badge variant="outline" className="max-w-[180px] truncate">{item.costCode}</Badge> : ""}
      </TableCell>
      <TableCell className="text-right">
        <Eye className="inline-block h-4 w-4" aria-hidden />
      </TableCell>
    </TableRow>
  );
}
