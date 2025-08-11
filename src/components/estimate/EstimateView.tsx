import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EstimateHeader } from "./EstimateHeader";
import { SectionPanel } from "./SectionPanel";
import { currency } from "./types";

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

import type { UIItem, UISection } from "./types";
// currency formatter moved to ./types

const divideCents = (value: number | undefined) => (typeof value === "number" ? value / 100 : 0);

export default function EstimateView() {
  const [sections, setSections] = useState<UISection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);

  // SEO: structured data
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Estimate Details",
      "description": "Interactive estimate sections with inline editing and real-time grand totals",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser"
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
      <main className="container py-10 space-y-6">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-end justify-between py-4">
            <div>
              <Skeleton className="h-6 w-32" />
              <div className="mt-2"><Skeleton className="h-4 w-64" /></div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-24" />
              <div className="mt-2"><Skeleton className="h-8 w-40" /></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-md border p-4">
              <Skeleton className="h-5 w-48" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-3/4" />
              </div>
            </div>
          ))}
        </div>
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
    <main className="min-h-screen">
      <EstimateHeader
        grandTotal={grandTotal}
        onExpandAll={() => setOpenSections(sections.map((s) => s.id))}
        onCollapseAll={() => setOpenSections([])}
      />

      <div className="container py-4 sm:py-6 lg:py-8 mt-6">
        <Separator className="mb-4 sm:mb-6" />

        <Accordion type="multiple" className="w-full space-y-2" value={openSections} onValueChange={(v) => setOpenSections(Array.isArray(v) ? v : [])}>
          {sections.map((sec) => (
            <SectionPanel
              key={sec.id}
              section={sec}
              currency={currency}
              sectionTotal={sectionTotal}
              updateQty={updateQty}
              updateUnitCost={updateUnitCost}
            />
          ))}
        </Accordion>
      </div>
    </main>
  );
}
