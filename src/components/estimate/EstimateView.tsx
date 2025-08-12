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
  subject?: string;
  item_id?: string;
  qty?: number;
  quantity?: number | string;
  unit_cost?: number | string; // cents
  unitCost?: number | string;  // cents (alt key)
  modified_unit_cost?: number | string; // cents (alt)
  unit?: string;
  unit_name?: string;
  tax?: boolean | string | number;
  is_taxable?: boolean | string | number;
  apply_global_tax?: string | number;
  cost_code?: string;
  costCode?: string;
  cost_code_name?: string;
  item_type_display_name?: string;
  item_type_name?: string;
  total?: number | string; // cents
}

interface ApiSection {
  id?: string;
  section_id?: string;
  name?: string;
  title?: string;
  section_name?: string;
  items?: ApiItem[];
}

interface ApiEnvelope {
  section?: ApiSection[];
  sections?: ApiSection[];
  data?: {
    section?: ApiSection[];
    sections?: ApiSection[];
  };
}

import type { UIItem, UISection } from "./types";
// currency formatter moved to ./types

const divideCents = (value: number | string | undefined | null) => {
  const num = typeof value === "string" ? Number(value) : typeof value === "number" ? value : 0;
  return Number.isFinite(num) ? num / 100 : 0;
};

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
        const primaryUrl = "/data/React JS- Estimate_detail (1).json";
        const fallbackUrl = "/data/estimate.json";

        let res = await fetch(encodeURI(primaryUrl), { cache: "no-store" });
        if (!res.ok) {
          res = await fetch(fallbackUrl, { cache: "no-store" });
        }
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data: ApiEnvelope = await res.json();
        if (ignore) return;

        const rawSections: ApiSection[] = (
          data.section ??
          data.sections ??
          data.data?.section ??
          data.data?.sections ??
          []
        );

        const mapped: UISection[] = rawSections.map((s, i) => ({
          id: s.id ?? s.section_id ?? `sec-${i + 1}`,
          name: s.name ?? s.title ?? s.section_name ?? `Section ${i + 1}`,
          items: (s.items ?? []).map((it, j) => ({
            id: it.id ?? it.item_id ?? `${i + 1}-${j + 1}`,
            type: it.type ?? it.item_type_display_name ?? it.item_type_name ?? "",
            name: it.name ?? it.item_name ?? it.subject ?? "",
            qty: Number(it.qty ?? it.quantity ?? 0),
            unit: it.unit ?? it.unit_name ?? "",
            unitCost: divideCents(it.unit_cost ?? it.unitCost ?? it.modified_unit_cost),
            tax: Boolean(
              it.tax ??
              it.is_taxable ??
              (it.apply_global_tax === '1' || it.apply_global_tax === 1)
            ),
            costCode: it.cost_code ?? it.costCode ?? it.cost_code_name ?? "",
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

        <div className="max-h-[55vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] xl:max-h-[75vh] overflow-y-auto pr-2 pb-8 relative">
          {sections.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">No information to display</p>
              </div>
            </div>
          ) : (
            <>
              {/* Main Table Headers */}
              <div className="hidden lg:block sticky top-0 z-50">
                <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                  <div className="grid grid-cols-2 gap-2 p-4 font-medium border-b">
                    <div className="whitespace-nowrap pl-4 font-medium text-base">Section</div>
                    <div className="w-[140px] text-right mr-4 justify-self-end font-medium text-base">Unit Cost per Item</div>
                  </div>
                </div>
              </div>
              
              <Accordion type="multiple" className="w-full space-y-1 p-4" value={openSections} onValueChange={(v) => setOpenSections(Array.isArray(v) ? v : [])}>
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}
