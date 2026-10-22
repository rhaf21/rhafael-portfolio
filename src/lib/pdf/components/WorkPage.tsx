import { Link, Page, Text, View } from "@react-pdf/renderer";
import { CAL_URL } from "@/data/navigation";
import { absoluteUrl } from "@/lib/site";
import { CHANGES, RATE_ROWS, RECEIPTS } from "../content";
import { colors, em, fonts, px, s, space } from "../styles";
import { Bar, Chip, Foot, Slip } from "./parts";

// Ledger columns in canvas pixels; they add up to the table's inner width (690 less the 1px borders).
const COLS = [165, 149, 160, 157, 57];
const TILTS = ["-1deg", "0.6deg", "-0.5deg"];

function SubHead({ title, note }: { title: string; note: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: space.section, marginBottom: px(12) }}>
      <Text style={{ fontFamily: fonts.display, fontSize: px(26), lineHeight: 1 }}>{title}</Text>
      <Text style={{ fontFamily: fonts.mono, fontSize: px(9.5), letterSpacing: em(0.1, 9.5), textTransform: "uppercase", color: colors.inkMuted }}>
        {note}
      </Text>
    </View>
  );
}

const th = {
  fontFamily: fonts.mono,
  fontWeight: 500,
  fontSize: px(8.5),
  letterSpacing: em(0.1, 8.5),
  textTransform: "uppercase" as const,
  color: colors.inkMuted,
};

/** Page two: receipts, before-and-after rows, and the four services with prices. */
export function WorkPage() {
  return (
    <Page size="A4" style={s.page}>
      <Bar label="The work · Services" />

      <View style={{ flexDirection: "row", alignItems: "flex-end", columnGap: px(40), paddingTop: px(32), paddingBottom: px(40) }}>
        <Text style={{ flexGrow: 1, flexBasis: 0, fontFamily: fonts.display, fontSize: px(52), lineHeight: 0.95, letterSpacing: em(-0.02, 52) }}>
          Work you can <Text style={s.accentItalic}>check.</Text>
        </Text>
        <Text style={[s.muted, { width: px(252) }]}>Every change ships with a receipt. Full case studies at rhafael.dev/projects.</Text>
      </View>

      <View style={{ flexDirection: "row", columnGap: px(24) }}>
        {RECEIPTS.map((r, n) => (
          <Slip
            key={r.client}
            client={r.client}
            meta={r.meta}
            rows={r.items}
            mutedValues
            total={r.total}
            stamp={r.stamp}
            style={{ flexGrow: 1, flexBasis: 0, transform: `rotate(${TILTS[n % TILTS.length]})` }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", columnGap: px(24), marginTop: px(12) }}>
        {RECEIPTS.map((r) => (
          <Link
            key={r.client}
            src={absoluteUrl(r.href)}
            style={{
              flexGrow: 1,
              flexBasis: 0,
              textAlign: "center",
              fontFamily: fonts.mono,
              fontSize: px(9.5),
              letterSpacing: em(0.02, 9.5),
              color: colors.accent,
              textDecoration: "none",
            }}
          >
            Read the case study ↗
          </Link>
        ))}
      </View>

      <SubHead title="Before and after" note="Selected changes" />
      <View style={{ position: "relative", backgroundColor: colors.surface, borderWidth: px(1), borderColor: colors.line }}>
        {/* The ledger's double margin rule, as on the site. */}
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: px(14),
            width: px(3),
            borderLeftWidth: px(1),
            borderRightWidth: px(1),
            borderColor: colors.accent,
            opacity: 0.6,
          }}
        />
        <View style={{ flexDirection: "row", borderBottomWidth: px(1), borderBottomColor: colors.ink }}>
          {["Client", "Change", "Before", "After", "Status"].map((h, i) => (
            <Text key={h} style={[th, { width: px(COLS[i]), paddingVertical: px(8), paddingRight: px(10), paddingLeft: px(i === 0 ? 30 : 10) }]}>
              {h}
            </Text>
          ))}
        </View>
        {CHANGES.map((row, n) => {
          const cell = (i: number) => ({ width: px(COLS[i]), paddingVertical: px(7), paddingRight: px(10), paddingLeft: px(i === 0 ? 30 : 10) });
          return (
            <View
              key={row.change}
              style={[
                { flexDirection: "row", alignItems: "center", fontSize: px(11.5), lineHeight: 1.4 },
                n < CHANGES.length - 1 ? { borderBottomWidth: px(1), borderBottomColor: colors.line } : {},
              ]}
            >
              <Text style={[cell(0), { fontWeight: 500 }]}>{row.client}</Text>
              <Text style={cell(1)}>{row.change}</Text>
              <Text style={[cell(2), { color: colors.inkSubtle, textDecoration: "line-through" }]}>{row.before}</Text>
              <Text style={cell(3)}>{row.after}</Text>
              <View style={cell(4)}>
                <Chip status={row.status}>{row.status}</Chip>
              </View>
            </View>
          );
        })}
      </View>

      <SubHead title="Services" note="Fixed quote after the audit" />
      <View style={{ borderTopWidth: px(1), borderTopColor: colors.ink }}>
        {RATE_ROWS.map((r) => (
          <View
            key={r.name}
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: px(16),
              paddingVertical: px(8),
              borderBottomWidth: px(1),
              borderBottomColor: colors.line,
            }}
          >
            <Text style={{ width: px(140), fontFamily: fonts.display, fontSize: px(18), lineHeight: 1.2 }}>{r.name}</Text>
            <Text style={[s.muted, { flexGrow: 1, flexBasis: 0 }]}>{r.line}</Text>
            <Text style={[s.muted, { width: px(108) }]}>{r.timeline}</Text>
            <Text style={{ width: px(120), fontFamily: fonts.display, fontSize: px(18), lineHeight: 1.2, textAlign: "right" }}>{r.price}</Text>
          </View>
        ))}
      </View>

      <Foot
        left={
          <>
            Book a 20-minute call ·{" "}
            <Link src={CAL_URL} style={{ color: colors.accent, textDecoration: "none" }}>
              cal.com/rhafael.dev
            </Link>
          </>
        }
        right="rhafael.dev · 2 of 2"
      />
    </Page>
  );
}
