const fs = require('fs');
const path = require('path');

const p = path.resolve(__dirname, '../public/data/React JS- Estimate_detail (1).json');
const rawJson = fs.readFileSync(p, 'utf8');
const d = JSON.parse(rawJson);

const rawSections = d.section || d.sections || (d.data && (d.data.section || d.data.sections)) || [];

const divideCents = (value) => {
  const num = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : 0;
  return Number.isFinite(num) ? num / 100 : 0;
};

const mapped = rawSections.map((s, i) => ({
  id: s.id || s.section_id || `sec-${i + 1}`,
  name: s.name || s.title || s.section_name || `Section ${i + 1}`,
  items: (s.items || []).map((it, j) => ({
    id: it.id || it.item_id || `${i + 1}-${j + 1}`,
    type: it.type || it.item_type_display_name || it.item_type_name || '',
    name: it.name || it.item_name || it.subject || '',
    qty: Number(it.qty ?? it.quantity ?? 0),
    unit: it.unit || it.unit_name || '',
    unitCost: divideCents(it.unit_cost ?? it.unitCost ?? it.modified_unit_cost),
    tax: Boolean(it.tax ?? it.is_taxable ?? (it.apply_global_tax === '1' || it.apply_global_tax === 1)),
    costCode: it.cost_code || it.costCode || it.cost_code_name || '',
  }))
}));

const grandTotal = mapped.reduce((sum, s) => sum + s.items.reduce((sub, it) => sub + (Number(it.qty || 0) * Number(it.unitCost || 0)), 0), 0);

console.log({ sections: mapped.length, itemsFirst: mapped[0]?.items?.length, grandTotal, sampleItem: mapped[0]?.items?.[0] }); 