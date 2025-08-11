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
      <TableCell className="font-mono text-xs p-2 xl:p-3">{item.type}</TableCell>
      <TableCell className="p-2 xl:p-3">
        <div className="flex flex-col min-w-0">
          <span className="truncate" title={item.name}>{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right p-2 xl:p-3">
        <Input
          aria-label={`Quantity for ${item.name}`}
          inputMode="numeric"
          type="number"
          className="h-8 xl:h-9 text-right text-sm"
          value={Number.isFinite(item.qty) ? item.qty : 0}
          onChange={(e) => updateQty(sectionId, item.id, Number(e.target.value))}
          onKeyUp={(e) => updateQty(sectionId, item.id, Number((e.target as HTMLInputElement).value))}
          min={0}
          step={1}
        />
      </TableCell>
      <TableCell className="text-right p-2 xl:p-3">
        <Input
          aria-label={`Unit cost for ${item.name}`}
          inputMode="decimal"
          type="number"
          className="h-8 xl:h-9 text-right text-sm"
          value={Number.isFinite(item.unitCost) ? item.unitCost : 0}
          onChange={(e) => updateUnitCost(sectionId, item.id, Number(e.target.value))}
          onKeyUp={(e) => updateUnitCost(sectionId, item.id, Number((e.target as HTMLInputElement).value))}
          min={0}
          step={0.01}
        />
      </TableCell>
      <TableCell className="p-2 xl:p-3 text-sm">{item.unit}</TableCell>
      <TableCell className="text-right p-2 xl:p-3 font-medium">{currency.format(itemTotal)}</TableCell>
      <TableCell className="text-center p-2 xl:p-3">
        {item.tax ? (
          <Badge variant="secondary" className="text-xs">Tax</Badge>
        ) : (
          <span aria-hidden className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="p-2 xl:p-3 max-w-[180px]" title={item.costCode}>
        {item.costCode ? (
          <Badge variant="outline" className="max-w-full truncate text-xs block">
            <span className="truncate max-w-[140px] block">{item.costCode}</span>
          </Badge>
        ) : ""}
      </TableCell>
      <TableCell className="text-right p-2 xl:p-3">
        <Eye className="inline-block h-3 w-3 xl:h-4 xl:w-4 text-muted-foreground" aria-hidden />
      </TableCell>
    </TableRow>
  );
}