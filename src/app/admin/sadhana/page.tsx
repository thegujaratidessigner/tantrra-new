'use client';

import { BookOpen, Plus, Video, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const placeholderContent = [
  { title: 'Introduction to Meditation', category: 'meditation', access: 'free', status: 'published' },
  { title: 'Chakra Balancing Basics', category: 'chakra', access: 'free', status: 'published' },
  { title: 'Daily Mantra Practice', category: 'mantra', access: 'members_only', status: 'published' },
  { title: 'Advanced Sadhana Techniques', category: 'sadhana', access: 'members_only', status: 'draft' },
  { title: 'Puja Preparation Guide', category: 'puja-guidance', access: 'free', status: 'published' },
  { title: 'Sacred Space Setup', category: 'guidance', access: 'free', status: 'draft' },
];

export default function AdminSadhanaPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Sadhana Content
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Manage spiritual content, videos, and membership tiers.
          </p>
        </div>
        <Button variant="primary-green" size="sm">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Content Table */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Title
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Category
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Access
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {placeholderContent.map((item, i) => (
              <tr key={i} className="bg-white hover:bg-cream/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-foreground-subtle" />
                    <span className="font-medium text-foreground">
                      {item.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-foreground-muted">
                  {item.category.replace('-', ' ')}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs">
                    {item.access === 'members_only' ? (
                      <>
                        <Lock className="h-3 w-3 text-gold" />
                        <span className="text-gold-dark">Members</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 text-green" />
                        <span className="text-green">Free</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === 'published'
                        ? 'bg-green-muted text-green'
                        : 'bg-cream-dark text-foreground-subtle'
                    }`}
                  >
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Membership Tiers */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Membership Tiers
        </h2>
        <div className="mt-3 rounded-sm border border-gold/20 bg-gold-muted/20 p-5">
          <p className="text-sm text-foreground-muted">
            Membership tiers and access control will be configurable once
            Supabase authentication and payment subscriptions are
            connected.
          </p>
        </div>
      </div>
    </div>
  );
}
