import type { ReactNode } from "react";
import { Link, Text, View, type Styles } from "@react-pdf/renderer";
import { STATUS_CLASS, type Status } from "@/data/proof";
import { colors, px, s } from "../styles";

type Style = Styles[string];

export function Bar({ label }: { label: string }) {
  return (
    <View style={s.bar}>
      <View style={s.wordmark}>
        <Text style={s.wordmarkText}>rhafael.dev</Text>
        <View style={s.wordmarkDot} />
      </View>
      <Text style={s.barLabel}>{label}</Text>
    </View>
  );
}

export function Foot({ left, right }: { left: ReactNode; right: string }) {
  return (
    <View style={s.foot}>
      <Text>{left}</Text>
      <Text>{right}</Text>
    </View>
  );
}

export function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

const CHIP_TONES: Record<string, { backgroundColor: string; color: string }> = {
  done: { backgroundColor: colors.successSoft, color: colors.success },
  rev: { backgroundColor: colors.accentSoft, color: colors.accentStrong },
  blocked: { backgroundColor: colors.ink, color: colors.canvas },
  input: { backgroundColor: colors.surface, color: colors.ink },
};

export function Chip({ status, children, style }: { status: Status; children: string; style?: Style }) {
  const tone = CHIP_TONES[STATUS_CLASS[status]];
  return (
    <View style={[s.chip, { backgroundColor: tone.backgroundColor }, style ?? {}]}>
      <Text style={[s.chipText, { color: tone.color }]}>{children}</Text>
    </View>
  );
}

/** A link with the site's accent underline, drawn as a border so it sits clear of the descenders. */
export function UnderLink({ href, children, size = 11.5 }: { href: string; children: string; size?: number }) {
  return (
    <View style={{ alignSelf: "flex-start", borderBottomWidth: px(1), borderBottomColor: colors.accent }}>
      <Link src={href} style={{ fontSize: px(size), lineHeight: 1.3, color: colors.ink, textDecoration: "none" }}>
        {children}
      </Link>
    </View>
  );
}

export function Stamp({ children }: { children: string }) {
  return (
    <View style={s.stamp}>
      <View style={s.stampInner}>
        <Text style={s.stampText}>{children}</Text>
      </View>
    </View>
  );
}

interface SlipProps {
  head?: string;
  client: string;
  meta?: string;
  rows: Array<[string, string]>;
  /** Item statuses print muted; result rows print in ink. */
  mutedValues?: boolean;
  total?: [string, string];
  stamp: string;
  style?: Style;
}

/** The site's receipt slip: head, client, dashed cuts, dotted leaders, a total, and a stamp. */
export function Slip({ head = "SHIPPING RECEIPT", client, meta, rows, mutedValues, total, stamp, style }: SlipProps) {
  return (
    <View style={[s.slip, style ?? {}]}>
      <Text style={s.slipHead}>{head}</Text>
      <Text style={s.slipClient}>{client}</Text>
      {meta && <Text style={s.slipMeta}>{meta}</Text>}
      <View style={s.slipCut} />
      {rows.map(([k, v]) => (
        <View key={k} style={s.slipRow}>
          <Text>{k}</Text>
          <View style={s.slipLeader} />
          <Text style={mutedValues ? s.muted : {}}>{v}</Text>
        </View>
      ))}
      {total && (
        <>
          {/* Pushes the total to the bottom, so totals line up across slips of different lengths. */}
          <View style={{ flexGrow: 1 }} />
          <View style={s.slipCut} />
          <View style={s.slipTotal}>
            <Text>{total[0]}</Text>
            <Text style={{ color: colors.accent }}>{total[1]}</Text>
          </View>
        </>
      )}
      <Stamp>{stamp}</Stamp>
    </View>
  );
}
