/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Metadata } from "next";
import config from "@/payload.config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
// @ts-ignore - importMap is generated at build time
import { importMap } from "../importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async (args: Args): Promise<Metadata> => {
  return generatePageMetadata({ config, ...args });
};

export default async function Page(args: Args) {
  return RootPage({ config, importMap, ...args });
}
