import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { Card, field } from '@/components/admin/ui';
import { MediaField } from '@/components/admin/media/MediaField';
import { SERVICE_KINDS, TITHI_ICONS, type ServiceKind } from '@/lib/admin/service-kinds';
import { saveOffering } from './actions';

export interface OfferingValues {
  id?: string; kind: ServiceKind; group_id: string | null; slug: string | null; name: string; name_alt: string | null;
  short_description: string; long_description: string; includes: string[]; image_url: string | null; price: number | null;
  preset_amounts: number[]; allow_custom: boolean; duration: string | null; metadata: Record<string, unknown>;
  featured: boolean; is_active: boolean;
}

const input = (name: string, label: string, value: unknown, opts: { required?: boolean; type?: string; help?: string; max?: number } = {}) => (
  <label className="block">
    <span className={field.label}>{label}{opts.required && <span className="text-[#B5342E]"> *</span>}</span>
    <input name={name} type={opts.type ?? 'text'} defaultValue={(value as string | number | null) ?? ''} required={opts.required}
      maxLength={opts.type === 'number' ? undefined : opts.max ?? 200} min={opts.type === 'number' ? 1 : undefined} step={opts.type === 'number' ? 1 : undefined}
      className={field.input} />
    {opts.help && <span className={field.help}>{opts.help}</span>}
  </label>
);
const area = (name: string, label: string, value: string, rows = 3, help?: string) => (
  <label className="block">
    <span className={field.label}>{label}</span>
    <textarea name={name} defaultValue={value} rows={rows} className={field.input} />
    {help && <span className={field.help}>{help}</span>}
  </label>
);
const check = (name: string, label: string, value: boolean) => (
  <label className="flex items-center gap-2.5 rounded-lg border border-[#EFEADF] px-3 py-2.5 text-[13px] font-medium">
    <input type="checkbox" name={name} defaultChecked={value} className="h-4 w-4 accent-[#1B3D2F]" /> {label}
  </label>
);

export function OfferingForm({ values, groups }: { values: OfferingValues; groups: { id: string; name: string }[] }) {
  const k = values.kind;
  const m = values.metadata;
  const combined = Boolean(m.combined);

  return (
    <ActionForm action={saveOffering} className="space-y-4">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <input type="hidden" name="kind" value={k} />
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICE_KINDS[k].group && !combined && (
            <label className="block">
              <span className={field.label}>{k === 'consultation' ? 'Consultation service' : 'Day'} <span className="text-[#B5342E]">*</span></span>
              <select name="group_id" defaultValue={values.group_id ?? groups[0]?.id} className={field.input} required>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
          )}
          {input('name', k === 'consultation' ? 'Package name' : 'Name', values.name, { required: true, max: 160 })}
          {k === 'chadava-navagraha' && !combined && input('name_alt', 'Hindi name', values.name_alt, { max: 120 })}
          {k === 'chadava-navagraha' && !combined && input('graha', 'Graha', m.graha, { required: true, max: 40, help: 'Offerings are grouped under this graha on the day.' })}
          {k === 'chadava-deity' && input('deity', 'Deity', m.deity, { required: true, max: 80, help: 'Offerings are grouped by deity on the Chadava page.' })}
          {k === 'chadava-deity' && input('tier', 'Tier', m.tier, { max: 40, help: 'e.g. panchopchar or maha' })}
          {k === 'chadava-tithi' && input('deity', 'Deity', m.deity, { max: 80 })}
          {k === 'chadava-tithi' && (
            <label className="block">
              <span className={field.label}>Icon</span>
              <select name="icon" defaultValue={(m.icon as string) ?? ''} className={field.input}>
                <option value="">None</option>
                {TITHI_ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </label>
          )}
          {(k === 'puja' || k === 'daan-seva') && input('slug', 'URL slug', values.slug, { max: 80, help: 'Leave blank to generate from the name.' })}
          {k === 'consultation' && input('duration', 'Duration', values.duration, { max: 60, help: 'e.g. 30-40 min' })}
        </div>
        {(k === 'consultation' || k === 'puja' || k === 'daan-seva' || combined) && (
          <div className="mt-4 space-y-4">
            {area('short_description', 'Description', values.short_description, 3)}
            {(k === 'puja' || combined) && area('includes', 'Includes (one per line)', values.includes.join('\n'), 4)}
            {combined && area('panchopchar', 'Panchopchar items (one per line)', ((m.panchopchar as string[]) ?? []).join('\n'), 3)}
            {combined && area('note', 'Note shown under the offering', (m.note as string) ?? '', 2)}
          </div>
        )}
      </Card>

      <Card title="Price & availability">
        <div className="grid gap-4 sm:grid-cols-2">
          {k === 'daan-seva' ? (
            <>
              {input('preset_amounts', 'Preset amounts (₹, comma separated)', values.preset_amounts.join(', '), { help: 'e.g. 101, 501, 1100' })}
              {check('allow_custom', 'Allow devotees to enter a custom amount (₹1 – ₹5,00,000)', values.allow_custom)}
            </>
          ) : (
            input('price', 'Price (₹)', values.price, { type: 'number', required: values.is_active, help: 'Whole rupees, tax inclusive. Used by checkout immediately.' })
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {check('is_active', 'Available for booking', values.is_active)}
          {(k === 'puja') && check('featured', 'Featured', values.featured)}
        </div>
      </Card>

      {(k === 'puja' || k === 'daan-seva') && (
        <Card title="Image">
          <MediaField name="image_url" label="Card image" accept="image" defaultValue={values.image_url} help="Shown at its natural proportions on the card." />
        </Card>
      )}

      <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-[#E8E2D4] bg-[#F6F3EC]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton>{values.id ? 'Save' : 'Create'}</SubmitButton>
      </div>
    </ActionForm>
  );
}
