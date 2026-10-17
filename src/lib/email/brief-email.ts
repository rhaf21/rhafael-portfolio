// The notification email for a contact brief, styled like the site's receipts.
// Email clients ignore stylesheets and web fonts, so everything is inline, the
// layout is tables, and the type falls back to Georgia and Menlo.

export interface Brief {
  name: string;
  email: string;
  need?: string;
  platforms?: string;
  budget?: string;
  timing?: string;
  notes?: string;
  /** The whole message as sent, used when the structured answers are missing. */
  message: string;
}

const C = {
  canvas: "#f4f4f1",
  surface: "#ffffff",
  sunk: "#f4f4f1",
  ink: "#121214",
  muted: "#5b5b62",
  subtle: "#86868d",
  line: "#e2e1dc",
  accent: "#b8461b",
  accentSoft: "#f6e4d9",
  accentStrong: "#973812",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "Menlo,Consolas,'Courier New',monospace";

// How the headline finishes for each answer to "What do you need help with?"
const WANTS: Record<string, string> = {
  "Fix something broken": "needs something fixed.",
  "Build something new": "wants something built.",
  "Audit what I have": "wants an audit.",
  "Ongoing help": "wants ongoing help.",
  "Not sure yet": "isn't sure yet.",
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Line breaks become <br>, and only that: no pre-wrap, so lines aren't doubled. */
const paragraphs = (value: string) => esc(value.trim()).replace(/\r?\n/g, "<br>");

function replyBy(sent: Date, timeZone: string): string {
  const due = new Date(sent.getTime() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(due);
}

export function briefEmail(brief: Brief, sent = new Date(), timeZone = "Asia/Manila") {
  const first = brief.name.trim().split(/\s+/)[0];
  const structured = Boolean(brief.need);
  const notes = structured ? (brief.notes ?? "").trim() : brief.message.trim();
  const wants = (brief.need && WANTS[brief.need]) || "sent a brief.";
  const due = replyBy(sent, timeZone);

  const subject = ["New brief", brief.name, brief.need, brief.platforms].filter(Boolean).join(" · ");
  const preheader = [brief.need, brief.platforms, brief.budget, brief.timing].filter(Boolean).join(" · ");

  const replyBody = [
    `Hi ${first},`,
    "",
    `Thanks for the brief${brief.need ? ` (${brief.need.toLowerCase()}${brief.platforms ? `, ${brief.platforms}` : ""})` : ""}. A few times that work for a 20-minute call:`,
    "",
    "- ",
    "- ",
    "- ",
    "",
    "Rhafael",
  ].join("\n");
  const mailto = `mailto:${brief.email}?subject=${encodeURIComponent("Re: your brief")}&body=${encodeURIComponent(replyBody)}`;

  const rows: Array<[string, string | undefined]> = [
    ["Need", brief.need],
    ["Platforms", brief.platforms],
    ["Budget", brief.budget],
    ["Timing", brief.timing],
  ];
  const rowHtml = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `
              <tr>
                <td style="padding:12px 0;border-bottom:1px dashed ${C.line};font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.subtle};width:110px;vertical-align:top;">${k}</td>
                <td style="padding:12px 0;border-bottom:1px dashed ${C.line};font-family:${SANS};font-size:15px;color:${C.ink};text-align:right;">${esc(v!)}</td>
              </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.canvas};">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr>
          <td style="padding:0 4px 16px;font-family:${SERIF};font-size:20px;color:${C.ink};">Rhafael Corpuz<span style="color:${C.accent};">.</span></td>
          <td align="right" style="padding:0 4px 16px;font-family:${MONO};font-size:11px;letter-spacing:.12em;color:${C.subtle};">NEW BRIEF</td>
        </tr>
        <tr>
          <td colspan="2" style="background:${C.surface};border:1px solid ${C.line};border-radius:18px;padding:32px 28px;">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${C.subtle};">From the brief on rhafael.dev</div>
            <h1 style="margin:14px 0 0;font-family:${SERIF};font-weight:400;font-size:32px;line-height:1.1;color:${C.ink};">${esc(brief.name)}<br><em style="color:${C.accent};">${esc(wants)}</em></h1>
            <p style="margin:12px 0 0;font-family:${SANS};font-size:15px;color:${C.muted};"><a href="mailto:${esc(brief.email)}" style="color:${C.muted};">${esc(brief.email)}</a></p>
            ${
              rowHtml
                ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid ${C.ink};">${rowHtml}
            </table>`
                : ""
            }
            <div style="margin-top:24px;font-family:${MONO};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${C.subtle};">${structured ? "Their notes" : "Their message"}</div>
            <div style="margin-top:8px;background:${C.sunk};border-radius:12px;padding:16px 18px;font-family:${SANS};font-size:15px;line-height:1.6;color:${notes ? C.ink : C.subtle};">${notes ? paragraphs(notes) : "No notes added."}</div>
            <div style="margin-top:28px;">
              <span style="display:inline-block;background:${C.accentSoft};color:${C.accentStrong};border-radius:999px;padding:7px 14px;font-family:${MONO};font-size:12px;white-space:nowrap;">Reply by ${esc(due)}</span>
            </div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              <tr>
                <td style="background:${C.ink};border-radius:999px;">
                  <a href="${esc(mailto)}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;white-space:nowrap;">Reply to ${esc(first)} &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:18px 4px 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.subtle};">The site promised a reply within 24 hours. Hitting reply in your inbox answers ${esc(brief.email)} directly.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    `New brief from ${brief.name} (${brief.email})`,
    "",
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    structured ? "Their notes:" : "Their message:",
    notes || "No notes added.",
    "",
    `Reply by ${due}.`,
  ].join("\n");

  return { subject, html, text };
}
