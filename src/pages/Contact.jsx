import { useState } from "react";
import { profile } from "../data/profile";
import { PrintCVButton } from "../components/PrintCVButton";
import { SocialLinks } from "../components/SocialLinks";
import { useSEO } from "../hooks/useSEO";

// Static-site contact form: since there's no backend yet, submitting builds a
// pre-filled mailto: link rather than posting anywhere. Swap this handler for
// a Formspree/EmailJS endpoint later if you want an in-page submit + toast
// instead of handing off to the visitor's mail client.
function buildMailto({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio contact from ${name || "a visitor"}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  return `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  useSEO({
    title: "Contact",
    description: "Get in touch with Renee Astraea — email, LinkedIn, GitHub, Kaggle, Instagram, and WhatsApp.",
    path: "/contact",
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    window.location.href = buildMailto(form);
  }

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-4xl gap-16 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-medium text-ink">Contact</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Open to research collaborations, project feedback, or just casual talking! Replies fastest by WhatsApp.
          </p>

          <SocialLinks className="mt-8" />

          <div className="mt-8 border-t border-blush/70 pt-6">
            <PrintCVButton variant="pill" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm text-ink-soft">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="border border-blush bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-ink-soft">
              Your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="border border-blush bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm text-ink-soft">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="border border-blush bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 self-start rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-paper transition hover:brightness-90"
          >
            Send message
          </button>
          <p className="text-xs text-ink-soft">
            Opens your email client with this pre-filled — there's no backend wired up yet.
          </p>
        </form>
      </div>
    </section>
  );
}
