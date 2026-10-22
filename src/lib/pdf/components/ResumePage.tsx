import { Link, Page, Text, View } from "@react-pdf/renderer";
import { CAL_URL, UPWORK_URL } from "@/data/navigation";
import type { SiteSettingsData } from "@/lib/payload";
import { absoluteUrl, PERSON, SITE_URL } from "@/lib/site";
import { EXPERIENCE, HOW_I_WORK, LEDE, LINKEDIN_FALLBACK, PRODUCTS, RESULTS, SKILLS } from "../content";
import { colors, em, fonts, px, s, space } from "../styles";
import { Bar, Chip, Foot, Label, Slip, UnderLink } from "./parts";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const lastSegment = (url: string) => bare(url).split("/").pop() ?? url;
const href = (path: string) => (path.startsWith("http") ? path : absoluteUrl(path));

/** Page one: the resume itself. Two columns under a header with the contact list beside the name. */
export function ResumePage({ settings, updated }: { settings: SiteSettingsData; updated: string }) {
  const email = settings.email || "rhafaelcorpuz21@gmail.com";
  const github = settings.socialLinks.find((l) => l.platform === "github")?.url;
  const linkedin = settings.socialLinks.find((l) => l.platform === "linkedin")?.url || LINKEDIN_FALLBACK;

  const contact: Array<[string, string, string]> = [
    ["Email", email, `mailto:${email}`],
    ["Website", bare(SITE_URL), SITE_URL],
    // The Cal.com profile reads shorter than the event link and still lands on the booking page.
    ["Book", bare(CAL_URL.replace(/\/[^/]+$/, "")), CAL_URL],
    ["Upwork", lastSegment(UPWORK_URL), UPWORK_URL],
    ...(github ? [["GitHub", lastSegment(github), github] as [string, string, string]] : []),
    ["LinkedIn", PERSON.name, linkedin],
  ];

  return (
    <Page size="A4" style={s.page}>
      <Bar label={`Resume · ${updated}`} />

      {/* Header: name block bottom-aligned with the contact list. */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", columnGap: px(40), paddingTop: px(32), paddingBottom: px(40) }}>
        <View style={{ flexGrow: 1, flexBasis: 0 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: px(72), lineHeight: 0.95, letterSpacing: em(-0.025, 72) }}>
            {PERSON.name}
          </Text>
          <Text style={{ fontSize: px(15), fontWeight: 500, marginTop: px(16) }}>{PERSON.jobTitle}</Text>
          <Text style={[s.muted, { fontSize: px(12.5), marginTop: px(4) }]}>{LEDE}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: px(8), marginTop: px(20) }}>
            <View
              style={{
                width: px(6),
                height: px(6),
                borderRadius: px(3),
                backgroundColor: settings.availableForWork ? colors.success : colors.inkSubtle,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: px(9.5),
                letterSpacing: em(0.08, 9.5),
                textTransform: "uppercase",
                color: settings.availableForWork ? colors.success : colors.inkMuted,
              }}
            >
              {settings.availableForWork
                ? "Taking new projects · replies within 24 hours"
                : "Fully booked right now · ask about the next opening"}
            </Text>
          </View>
        </View>

        <View style={{ width: px(252), borderTopWidth: px(1), borderTopColor: colors.ink }}>
          {contact.map(([k, text, url]) => (
            <View
              key={k}
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: px(10),
                paddingVertical: px(4),
                borderBottomWidth: px(1),
                borderBottomColor: colors.line,
              }}
            >
              <Text
                style={{
                  width: px(62),
                  fontFamily: fonts.mono,
                  fontSize: px(8.5),
                  letterSpacing: em(0.1, 8.5),
                  textTransform: "uppercase",
                  color: colors.inkMuted,
                }}
              >
                {k}
              </Text>
              <UnderLink href={url}>{text}</UnderLink>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", columnGap: px(40) }}>
        {/* Left: experience, own products, how I work. */}
        <View style={{ flexGrow: 1.7, flexBasis: 0 }}>
          <Label>Experience</Label>
          {EXPERIENCE.map((role, n) => (
            <View
              key={role.org}
              style={[
                { flexDirection: "row", columnGap: px(14) },
                n > 0 ? { marginTop: space.item, paddingTop: space.item, borderTopWidth: px(1), borderTopColor: colors.line } : {},
              ]}
            >
              <Text
                style={{
                  width: px(84),
                  paddingTop: px(2),
                  fontFamily: fonts.mono,
                  fontSize: px(9.5),
                  lineHeight: 1.6,
                  letterSpacing: em(0.06, 9.5),
                  textTransform: "uppercase",
                  color: colors.inkMuted,
                }}
              >
                {role.when}
              </Text>
              <View style={{ flexGrow: 1, flexBasis: 0 }}>
                <Text style={{ fontSize: px(13), fontWeight: 600, lineHeight: 1.3 }}>
                  {role.org}
                  <Text style={{ fontWeight: 400, color: colors.inkMuted }}> · {role.title}</Text>
                </Text>
                {role.line && <Text style={[s.muted, { marginTop: px(2) }]}>{role.line}</Text>}
                {role.points && (
                  <View style={{ marginTop: px(8) }}>
                    {role.points.map(([who, what], i) => (
                      <View key={who} style={{ flexDirection: "row", marginTop: i > 0 ? px(4) : 0 }}>
                        <View style={{ width: px(5), height: px(1), backgroundColor: colors.accent, marginTop: px(8.5), marginRight: px(9) }} />
                        <Text style={[s.muted, { flexGrow: 1, flexBasis: 0 }]}>
                          <Text style={{ color: colors.ink, fontWeight: 500 }}>{who}:</Text> {what}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}

          <View style={{ marginTop: space.section }}>
            <Label>My own products</Label>
            {PRODUCTS.map((p, n) => (
              <View
                key={p.name}
                style={[
                  { flexDirection: "row", columnGap: px(14) },
                  n > 0 ? { marginTop: space.item, paddingTop: space.item, borderTopWidth: px(1), borderTopColor: colors.line } : {},
                ]}
              >
                <View style={{ width: px(84) }}>
                  {/* Nudged so the chip's text sits on the name's baseline. */}
                  <Chip status={p.tone} style={{ marginTop: px(4.5) }}>
                    {p.status}
                  </Chip>
                </View>
                <View style={{ flexGrow: 1, flexBasis: 0 }}>
                  <Link src={href(p.href)} style={{ fontFamily: fonts.display, fontSize: px(19), lineHeight: 1, color: colors.ink, textDecoration: "none" }}>
                    {p.name}
                  </Link>
                  <Text style={[s.muted, { marginTop: px(4) }]}>{p.line}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: space.section }}>
            <Label>How I work</Label>
            {HOW_I_WORK.map((rule, n) => (
              <Text
                key={rule}
                style={{
                  fontWeight: 500,
                  // react-pdf sets text a little lower in its line box than a browser, so 10 here matches the canvas's 12.
                  paddingTop: n === 0 ? 0 : px(10),
                  paddingBottom: px(10),
                  borderBottomWidth: px(1),
                  borderBottomColor: colors.line,
                }}
              >
                {rule}
              </Text>
            ))}
          </View>
        </View>

        {/* Right: the results receipt, then skills. */}
        <View style={{ flexGrow: 1, flexBasis: 0 }}>
          <Slip client="Results, so far" rows={RESULTS} stamp="CHECKED" style={{ transform: "rotate(1.2deg)" }} />
          <View style={{ marginTop: space.section }}>
            <Label>Skills</Label>
            {SKILLS.map(([group, list], n) => (
              <View key={group} style={{ marginTop: n > 0 ? space.item : 0 }}>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontWeight: 500,
                    fontSize: px(9),
                    letterSpacing: em(0.1, 9),
                    textTransform: "uppercase",
                  }}
                >
                  {group}
                </Text>
                <Text style={[s.muted, { marginTop: px(2) }]}>{list}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Foot left={`${PERSON.name} · Work you can check`} right="rhafael.dev · 1 of 2" />
    </Page>
  );
}
