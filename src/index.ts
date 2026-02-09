import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

/**
 * MCP Server: /bmad-quick-spec 프롬프트가 입력되면 해당 프롬프트를 그대로 반환합니다.
 * Cloudflare Workers에서 Streamable HTTP 전송으로 동작합니다.
 */
export class BmadQuickSpecMCP extends McpAgent {
  server = new McpServer({
    name: "bmad-quick-spec",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "bmad-quick-spec",
      {
        prompt: z.string().describe("입력된 프롬프트. 이 값이 그대로 반환됩니다."),
      },
      async ({ prompt }) => ({
        content: [{ type: "text", text: prompt }],
      })
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return BmadQuickSpecMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
