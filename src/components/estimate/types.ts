export interface UIItem {
  id: string;
  type: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number; // original value (not cents)
  tax: boolean;
  costCode?: string;
}

export interface UISection {
  id: string;
  name: string;
  items: UIItem[];
}

export const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});
