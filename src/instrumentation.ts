export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Some local resolvers refuse SRV records, which breaks `mongodb+srv://`
  // connection strings (e.g. MongoDB Atlas). Pin Node's DNS to known-good
  // public resolvers so Payload can reach Atlas regardless of system DNS.
  // Use a non-static specifier so webpack doesn't try to bundle the Node
  // built-in.
  const moduleName = "dns";
  const dns = await import(/* webpackIgnore: true */ moduleName);
  dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);
}
