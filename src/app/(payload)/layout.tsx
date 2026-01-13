/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ReactNode } from "react";
import "@payloadcms/next/css";
import config from "@/payload.config";
import { RootLayout } from "@payloadcms/next/layouts";
// @ts-ignore - importMap is generated at build time
import { importMap } from "./admin/importMap";
import { serverFunction } from "./serverFunction";

import "./custom.scss";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
