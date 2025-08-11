import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
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
      <AccordionTrigger className="px-2 sm:px-3">
        <div className="flex w-full items-center justify-between min-w-0">
          <div className="font-medium truncate pr-2">{section.name}</div>
          <div className="text-muted-foreground text-sm sm:text-base flex-shrink-0">{currency.format(sectionTotal(section))}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {/* Mobile Card Layout */}
        <div className="block lg:hidden p-2 sm:p-3">
          {section.items.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No items to display</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {section.items.map((it) => (
                <div key={it.id} className="border rounded-lg p-3 space-y-3 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="font-medium text-sm truncate">{it.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {it.type && <span className="text-xs font-mono text-muted-foreground">{it.type}</span>}
                        {it.tax && <span className="text-green-600 text-sm">✓</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">{currency.format(Number(it.qty || 0) * Number(it.unitCost || 0))}</div>
                      <div className="text-xs text-muted-foreground">{it.unit}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Quantity</label>
                      <Input
                        aria-label={`Quantity for ${it.name}`}
                        inputMode="numeric"
                        type="number"
                        className="h-8 text-sm"
                        value={Number.isFinite(it.qty) && it.qty > 0 ? (it.qty > 10 ? it.qty.toString() : it.qty) : ''}
                        onChange={(e) => updateQty(section.id, it.id, Number(e.target.value))}
                        onKeyUp={(e) => updateQty(section.id, it.id, Number((e.target as HTMLInputElement).value))}
                        min={0}
                        step={1}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Unit Cost</label>
                      <Input
                        aria-label={`Unit cost for ${it.name}`}
                        inputMode="decimal"
                        type="number"
                        className="h-8 text-sm"
                        value={Number.isFinite(it.unitCost) ? it.unitCost : 0}
                        onChange={(e) => updateUnitCost(section.id, it.id, Number(e.target.value))}
                        onKeyUp={(e) => updateUnitCost(section.id, it.id, Number((e.target as HTMLInputElement).value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  </div>

                  {it.costCode && (
                    <div className="w-full">
                      <Badge variant="outline" className="text-xs max-w-full truncate block" title={it.costCode}>
                        <span className="truncate max-w-[120px] block">{it.costCode}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block p-2 sm:p-3">
          <div className="border rounded-lg overflow-hidden">
            {section.items.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No items to display</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background border-b">
                    <TableRow>
                      <TableHead className="whitespace-nowrap bg-background">Type</TableHead>
                      <TableHead className="min-w-[280px] bg-background">Item Name</TableHead>
                      <TableHead className="w-[100px] text-right bg-background">QTY</TableHead>
                      <TableHead className="w-[140px] text-right bg-background">Unit Cost</TableHead>
                      <TableHead className="w-[100px] bg-background">Unit</TableHead>
                      <TableHead className="w-[140px] text-right bg-background">Total</TableHead>
                      <TableHead className="w-[70px] text-center bg-background">Tax</TableHead>
                      <TableHead className="min-w-[180px] bg-background">Cost Code</TableHead>
                      <TableHead className="w-[50px] bg-background"></TableHead>
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
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
