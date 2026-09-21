import { useState } from "react";
import { PrintCVButton } from "../components/PrintCVButton";
import { SocialLinks } from "../components/SocialLinks";
import { buildMeta } from "../lib/seo";

// Formspree-backed contact form: submissions POST as JSON to your Formspree
// endpoint instead of building a mailto: link. Formspree handles validation,
// spam filtering, and email delivery on their side — no server code here.
//
// Setup: replace FORMSPREE_FORM_ID below with the ID from your Formspree
// dashboard (see the setup steps you were given alongside this patch).
const FORMSPREE_FORM_ID = "mdekgovb";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

export function meta() {
  return buildMeta({
    title: "Contact",
    description: "Get in touch with Renee Astraea! Email, LinkedIn, GitHub, Kaggle, Instagram, and WhatsApp.",
    path: "/contact",
  });
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // status: "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      // Network failure, ad blocker, offline, etc.
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-medium text-ink">Message sent</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Thanks for reaching out! I'll get back to you soon. Replies fastest by WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 rounded-full border border-blush px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent-deep hover:text-accent-deep"
          >
            Send another message
          </button>
        </div>
      </section>
    );
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
            disabled={status === "sending"}
            className="mt-2 self-start rounded-full bg-accent-deep px-6 py-3 text-sm font-medium text-paper transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {status === "error" && (
            <p role="alert" className="text-xs text-red-600">
              Something went wrong sending that. Please try again, or email me directly.
            </p>
          )}
          <p className="text-xs text-ink-soft">Sent directly through the form. No email client required.</p>
        </form>
      </div>
    </section>
  );
}

export default Contact;
