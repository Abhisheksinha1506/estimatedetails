import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";

// Types inferred from the mock API
interface ApiItem {
  id: string;
  type?: string;
  name?: string;
  item_name?: string;
  qty?: number;
  quantity?: number;
  unit_cost?: number; // cents
  unitCost?: number;  // cents (alt key)
  unit?: string;
  unit_name?: string;
  tax?: boolean;
  is_taxable?: boolean;
  cost_code?: string;
  costCode?: string;
  total?: number; // cents
}

interface ApiSection {
  id: string;
  name?: string;
  title?: string;
  items?: ApiItem[];
}

interface ApiResponse {
  section?: ApiSection[];
  sections?: ApiSection[];
}

// UI types after transformation
interface UIItem {
  id: string;
  type: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number; // original value (not cents)
  tax: boolean;
  costCode?: string;
}

interface UISection {
  id: string;
  name: string;
  items: UIItem[];
}

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const divideCents = (value: number | undefined) => (typeof value === "number" ? value / 100 : 0);

export default function EstimateView() {
  const [sections, setSections] = useState<UISection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/data/estimate.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data: ApiResponse = await res.json();
        if (ignore) return;
        const rawSections = data.section ?? data.sections ?? [];
        const mapped: UISection[] = rawSections.map((s, i) => ({
          id: s.id ?? `sec-${i + 1}`,
          name: s.name ?? s.title ?? `Section ${i + 1}`,
          items: (s.items ?? []).map((it, j) => ({
            id: it.id ?? `${i + 1}-${j + 1}`,
            type: it.type ?? "",
            name: it.name ?? it.item_name ?? "",
            qty: Number(it.qty ?? it.quantity ?? 0),
            unit: it.unit ?? it.unit_name ?? "",
            unitCost: divideCents(it.unit_cost ?? it.unitCost),
            tax: Boolean(it.tax ?? it.is_taxable ?? false),
            costCode: it.cost_code ?? it.costCode ?? "",
          })),
        }));
        setSections(mapped);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const updateQty = useCallback((sectionId: string, itemId: string, qty: number) => {
    setSections(prev => prev.map(sec =>
      sec.id !== sectionId ? sec : { ...sec, items: sec.items.map(it => it.id === itemId ? { ...it, qty } : it) }
    ));
  }, []);

  const updateUnitCost = useCallback((sectionId: string, itemId: string, unitCost: number) => {
    setSections(prev => prev.map(sec =>
      sec.id !== sectionId ? sec : { ...sec, items: sec.items.map(it => it.id === itemId ? { ...it, unitCost } : it) }
    ));
  }, []);

  const sectionTotal = useCallback((sec: UISection) => {
    return sec.items.reduce((sum, it) => sum + (Number(it.qty || 0) * Number(it.unitCost || 0)), 0);
  }, []);

  const grandTotal = useMemo(() => sections.reduce((sum, s) => sum + sectionTotal(s), 0), [sections, sectionTotal]);

  if (loading) {
    return (
      <main className="container py-10">
        <h1 className="text-3xl font-semibold mb-4">Estimate</h1>
        <p className="text-muted-foreground">Loading estimate…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-10">
        <h1 className="text-3xl font-semibold mb-4">Estimate</h1>
        <p className="text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="container py-8 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Estimate</h1>
          <p className="text-sm text-muted-foreground">Inline editable quantities and unit costs with instant totals.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Grand Total</div>
          <div className="text-3xl font-bold">{currency.format(grandTotal)}</div>
        </div>
      </header>

      <Separator />

      <Accordion type="multiple" className="w-full">
        {sections.map((sec) => (
          <AccordionItem value={sec.id} key={sec.id}>
            <AccordionTrigger className="px-3">
              <div className="flex w-full items-center justify-between">
                <div className="font-medium">{sec.name}</div>
                <div className="text-muted-foreground">{currency.format(sectionTotal(sec))}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
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
                    {sec.items.map((it) => {
                      const itemTotal = Number(it.qty || 0) * Number(it.unitCost || 0);
                      return (
                        <TableRow key={it.id}>
                          <TableCell className="font-mono text-xs">{it.type}</TableCell>
                          <TableCell>{it.name}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              aria-label={`Quantity for ${it.name}`}
                              inputMode="numeric"
                              type="number"
                              className="h-9 text-right"
                              value={Number.isFinite(it.qty) ? it.qty : 0}
                              onChange={(e) => updateQty(sec.id, it.id, Number(e.target.value))}
                              onKeyUp={(e) => updateQty(sec.id, it.id, Number((e.target as HTMLInputElement).value))}
                              min={0}
                              step={1}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              aria-label={`Unit cost for ${it.name}`}
                              inputMode="decimal"
                              type="number"
                              className="h-9 text-right"
                              value={Number.isFinite(it.unitCost) ? it.unitCost : 0}
                              onChange={(e) => updateUnitCost(sec.id, it.id, Number(e.target.value))}
                              onKeyUp={(e) => updateUnitCost(sec.id, it.id, Number((e.target as HTMLInputElement).value))}
                              min={0}
                              step={0.01}
                            />
                          </TableCell>
                          <TableCell>{it.unit}</TableCell>
                          <TableCell className="text-right">{currency.format(itemTotal)}</TableCell>
                          <TableCell className="text-center">{it.tax ? "✓" : ""}</TableCell>
                          <TableCell className="truncate" title={it.costCode}>{it.costCode}</TableCell>
                          <TableCell className="text-right"><Eye className="inline-block h-4 w-4" aria-hidden /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
