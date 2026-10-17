import Link from "next/link";
import type { CSSProperties } from "react";
import { STATUS_CLASS, type LedgerRow } from "@/data/proof";

/** Shipped changes as before/after rows. Each "before" is struck through as the row arrives. */
export function Ledger({ rows }: { rows: LedgerRow[] }) {
  return (
    <div className="ledger" data-reveal>
      <table>
        <thead>
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Change</th>
            <th scope="col">Before</th>
            <th scope="col">After</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.client}-${row.change}`} data-lane={row.lane} style={{ "--i": i } as CSSProperties}>
              <td className="c">{row.href ? <Link href={row.href}>{row.client}</Link> : row.client}</td>
              <td>{row.change}</td>
              <td>
                <span className="strike">{row.before}</span>
              </td>
              <td className="now">{row.after}</td>
              <td>
                <span className={`st ${STATUS_CLASS[row.status]}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
