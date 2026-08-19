'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What is a Kavach?',
    answer:
      'A Kavach is a sacred protective amulet or talisman prepared through traditional Vedic rituals, mantra recitation, and consecration. Each Kavach is specifically attuned to a deity and purpose, and is meant to be worn or kept close for spiritual protection and blessings.',
  },
  {
    question: 'How are the products prepared?',
    answer:
      'Each product undergoes traditional Panch Upchar Pujan with specific mantra recitations and consecration rituals appropriate to the deity and purpose. The preparation process is carried out with genuine devotion and follows traditional methods.',
  },
  {
    question: 'What is the Energization add-on?',
    answer:
      'The Energization add-on is an additional consecration process that enhances the spiritual potency of your product through extended mantra recitation and ritual procedures. It is optional and available for select products.',
  },
  {
    question: 'What is Brahmin Dakshina?',
    answer:
      'Brahmin Dakshina is an optional, voluntary offering made as a gesture of respect and gratitude to the Brahmin who performs the rituals and consecration for your product. It is entirely voluntary and does not affect your product or service.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Products are prepared over 3-5 working days (as each item requires proper consecration), followed by 5-7 working days for delivery. You will receive tracking details via email and WhatsApp once shipped.',
  },
  {
    question: 'How do consultations work?',
    answer:
      'After booking a consultation, you will receive a confirmation with scheduling details. Consultations are conducted by Tripuransh and may take 3-4 working days for delivery of written reports. Specific timelines vary by service type.',
  },
  {
    question: 'Can I request a custom Puja?',
    answer:
      'Yes, all our Pujas are available upon request. You can reach out via WhatsApp or the website to discuss your specific needs, and we will arrange the appropriate Puja with scheduling and contribution details.',
  },
  {
    question: 'What is Seva / Chadava?',
    answer:
      'Seva is selfless service, and Chadava is a sacred offering. Through TANTRRA, you can contribute to various Seva initiatives including Brahmin Seva, Gau Seva, Kanya Pujan, and Vriddha Seva. Your contributions go directly toward supporting these causes.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes. All payments are processed through secure, PCI-compliant payment gateways. We do not store your payment card details on our servers.',
  },
  {
    question: 'Can I return a consecrated product?',
    answer:
      'Due to the sacred and consecrated nature of our products, they cannot be returned or exchanged once prepared. If you receive a damaged or incorrect item, please contact us within 48 hours with photographs and we will arrange a replacement.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-base font-semibold text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-foreground-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-foreground-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Support
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-foreground-muted">
            Find answers to common questions about our products, services,
            and spiritual practices.
          </p>

          <div className="mt-8 border-t border-border">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
