declare namespace Cloudflare {
  interface Env {
    MCP_OBJECT: DurableObjectNamespace;
  }
}
interface Env extends Cloudflare.Env {}
