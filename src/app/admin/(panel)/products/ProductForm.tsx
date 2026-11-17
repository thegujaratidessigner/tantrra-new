import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { Card, field } from '@/components/admin/ui';
import { saveProduct } from './actions';

export interface ProductFormValues {
  id?: string; name: string; slug: string; category_slug: string; short_description: string; long_description: string; purpose: string;
  price: number | ''; compare_price: number | null; sku: string | null; weight: string | null; preparation_info: string | null;
  how_to_use: string | null; care_instructions: string | null; benefits: string[]; recommended_for: string[]; kit_includes: string[];
  badge: string | null; featured: boolean; is_active: boolean; in_stock: boolean; stock_quantity: number | null;
  energization_available: boolean; whatsapp_customization: boolean; seo_title: string | null; seo_description: string | null;
  test_only: boolean;
}

const Text = ({ name, label, value, required, max = 300, help, type = 'text' }: { name: string; label: string; value?: string | number | null; required?: boolean; max?: number; help?: string; type?: string }) => (
  <label className="block">
    <span className={field.label}>{label}{required && <span className="text-[#B5342E]"> *</span>}</span>
    <input name={name} type={type} defaultValue={value ?? ''} required={required} maxLength={type === 'text' ? max : undefined} min={type === 'number' ? 0 : undefined} step={type === 'number' ? 1 : undefined} className={field.input} />
    {help && <span className={field.help}>{help}</span>}
  </label>
);

const Area = ({ name, label, value, rows = 3, help, max = 5000 }: { name: string; label: string; value?: string | null; rows?: number; help?: string; max?: number }) => (
  <label className="block">
    <span className={field.label}>{label}</span>
    <textarea name={name} rows={rows} defaultValue={value ?? ''} maxLength={max} className={field.input} />
    {help && <span className={field.help}>{help}</span>}
  </label>
);

const Check = ({ name, label, value, help }: { name: string; label: string; value: boolean; help?: string }) => (
  <label className="flex items-start gap-2.5 rounded-lg border border-[#EFEADF] px-3 py-2.5">
    <input type="checkbox" name={name} defaultChecked={value} className="mt-0.5 h-4 w-4 accent-[#1B3D2F]" />
    <span>
      <span className="text-[13px] font-medium">{label}</span>
      {help && <span className="block text-[11.5px] text-foreground-subtle">{help}</span>}
    </span>
  </label>
);

export function ProductForm({ values, categories }: { values: ProductFormValues; categories: { slug: string; name: string }[] }) {
  return (
    <ActionForm action={saveProduct} className="space-y-4">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <Card title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="name" label="Product name" value={values.name} required max={120} />
          <Text name="slug" label="URL slug" value={values.slug} max={80} help="Leave blank to generate from the name. Changing it changes the product link." />
          <label className="block">
            <span className={field.label}>Category <span className="text-[#B5342E]">*</span></span>
            <select name="category_slug" defaultValue={values.category_slug} required className={field.input}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <Text name="badge" label="Badge" value={values.badge} max={40} help="Optional short label, e.g. “Bestseller”." />
          <div className="sm:col-span-2"><Area name="short_description" label="Short description" value={values.short_description} rows={2} max={500} /></div>
          <div className="sm:col-span-2"><Area name="long_description" label="Full description" value={values.long_description} rows={6} /></div>
          <div className="sm:col-span-2"><Text name="purpose" label="Purpose" value={values.purpose} /></div>
        </div>
      </Card>

      <Card title="Price & stock">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text name="price" type="number" label="Price (₹)" value={values.price} required help="Whole rupees, tax inclusive. Used by checkout." />
          <Text name="compare_price" type="number" label="Compare-at price (₹)" value={values.compare_price} help="Optional, shown struck through." />
          <Text name="stock_quantity" type="number" label="Stock quantity" value={values.stock_quantity} help="Leave empty to not track stock." />
          <Text name="sku" label="SKU" value={values.sku} max={60} />
          <Text name="weight" label="Weight" value={values.weight} max={60} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Check name="is_active" label="Live on website" value={values.is_active} help="Needs at least one image." />
          <Check name="in_stock" label="In stock" value={values.in_stock} />
          <Check name="featured" label="Featured on homepage" value={values.featured} />
          <Check name="energization_available" label="Offer energization add-on" value={values.energization_available} />
          <Check name="whatsapp_customization" label="Show WhatsApp customisation link" value={values.whatsapp_customization} />
          <Check name="test_only" label="Test-only product (hidden)" value={values.test_only} help="Never shown in the store; only signed-in admins can buy it. Orders are marked as internal tests." />
        </div>
      </Card>

      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Area name="benefits" label="Benefits (one per line)" value={values.benefits.join('\n')} rows={4} />
          <Area name="recommended_for" label="Recommended for (one per line)" value={values.recommended_for.join('\n')} rows={4} />
          <Area name="kit_includes" label="Kit includes (one per line)" value={values.kit_includes.join('\n')} rows={4} />
          <Area name="preparation_info" label="Preparation" value={values.preparation_info} rows={4} max={2000} />
          <Area name="how_to_use" label="How to use" value={values.how_to_use} rows={4} max={2000} />
          <Area name="care_instructions" label="Care instructions" value={values.care_instructions} rows={4} max={2000} />
        </div>
      </Card>

      <Card title="Search engines">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="seo_title" label="SEO title" value={values.seo_title} max={120} />
          <Text name="seo_description" label="SEO description" value={values.seo_description} max={300} />
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-[#E8E2D4] bg-[#F6F3EC]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton>{values.id ? 'Save product' : 'Create product'}</SubmitButton>
      </div>
    </ActionForm>
  );
}
