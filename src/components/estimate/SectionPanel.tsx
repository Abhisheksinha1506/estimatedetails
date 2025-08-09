import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UISection } from "./types";
import { ItemRow } from "./ItemRow";

export function SectionPanel({
  section,
  currency,
  sectionTotal,
  updateQty,
  updateUnitCost,
}: {
  section: UISection;
  currency: Intl.NumberFormat;
  sectionTotal: (sec: UISection) => number;
  updateQty: (sectionId: string, itemId: string, qty: number) => void;
  updateUnitCost: (sectionId: string, itemId: string, unitCost: number) => void;
}) {
  return (
    <AccordionItem value={section.id}>
      <AccordionTrigger className="px-3">
        <div className="flex w-full items-center justify-between">
          <div className="font-medium">{section.name}</div>
          <div className="text-muted-foreground">{currency.format(sectionTotal(section))}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="min-w-[320px]">Item Name</TableHead>
                <TableHead className="w-[120px] text-right">QTY</TableHead>
                <TableHead className="w-[160px] text-right">Unit Cost</TableHead>
                <TableHead className="w-[120px]">Unit</TableHead>
                <TableHead className="w-[160px] text-right">Total</TableHead>
                <TableHead className="w-[80px] text-center">Tax</TableHead>
                <TableHead className="min-w-[220px]">Cost Code</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.items.map((it) => (
                <ItemRow
                  key={it.id}
                  sectionId={section.id}
                  item={it}
                  currency={currency}
                  updateQty={updateQty}
                  updateUnitCost={updateUnitCost}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
