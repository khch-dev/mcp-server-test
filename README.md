# MCP Server: bmad-quick-spec

`/bmad-quick-spec` 프롬프트가 입력되면 해당 프롬프트를 **그대로 반환**하는 MCP(Model Context Protocol) 서버입니다.  
TypeScript로 구현되었으며 **Cloudflare Workers**에서 Streamable HTTP 전송으로 동작합니다.

## 동작

- **도구 이름**: `bmad-quick-spec`
- **입력**: `prompt` (문자열) — 전달받은 프롬프트
- **출력**: 입력한 `prompt`를 변경 없이 그대로 반환

## 로컬 개발

```bash
cd mcp-bmad-quick-spec
npm install
npm run dev
```

서버는 터미널에 표시된 주소(예: `http://localhost:8787/mcp`)에서 실행됩니다.

### MCP Inspector로 테스트

다른 터미널에서:

```bash
npx @modelcontextprotocol/inspector@latest
```

브라우저에서 `http://localhost:5173` 을 열고, MCP 서버 URL에 터미널에 표시된 주소(예: `http://localhost:8787/mcp`)를 입력한 뒤 **Connect** → **List Tools** → `bmad-quick-spec` 호출로 동작을 확인할 수 있습니다.

## Cloudflare에 배포

### 1. Create Application + GitHub 연결 (권장)

대시보드에서 저장소를 연결하면 **push 시 자동 배포**됩니다.

1. [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **Create application**
2. **Import a repository** → **Get started**
3. GitHub 계정 선택 후 이 저장소(`khch-dev/mcp-server-test`) 선택
4. **설정**
   - **Build command**: 비워 두기 (또는 `npm run type-check` — 빌드 단계 없이 Wrangler가 TypeScript 번들)
   - **Deploy command**: `npm run deploy` 또는 기본값 `npx wrangler deploy`
   - **Root directory**: 비워 두기 (저장소 루트가 프로젝트 루트)
5. **Save and Deploy**

배포 후 URL: `https://mcp-bmad-quick-spec.<계정명>.workers.dev/mcp`  
이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

> **참고:** Cloudflare에 연결할 Worker 이름은 `wrangler.jsonc`의 `name`(`mcp-bmad-quick-spec`)과 맞추는 것이 좋습니다. ([문서](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/#workers-name-requirement))

### 2. workers.dev에 수동 배포 (CLI)

```bash
npm run deploy
```

배포 후 URL 예: `https://mcp-bmad-quick-spec.<계정명>.workers.dev/mcp`

### 3. 커스텀 도메인 연결 (Cloudflare에 도메인 생성된 경우)

Cloudflare 대시보드에서 이미 도메인을 추가한 상태라면:

1. **대시보드**: Workers & Pages → 해당 Worker 선택 → **Settings** → **Domains & Routes**
2. **Add** → **Custom Domain** 선택 후 사용할 호스트 입력 (예: `mcp.yourdomain.com`)
3. 저장하면 DNS와 인증서가 자동으로 설정됩니다.

또는 **Wrangler**로 라우트만 설정하려면, `wrangler.jsonc`에 다음을 추가할 수 있습니다 (도메인은 대시보드에서 Worker에 연결해야 함):

```jsonc
// wrangler.jsonc 에서 "observability" 다음에 추가 예시:
// "routes": [
//   { "pattern": "mcp.yourdomain.com", "custom_domain": true }
// ],
```

도메인을 Worker에 연결한 뒤에는 `https://mcp.yourdomain.com/mcp` 로 MCP 엔드포인트에 접속할 수 있습니다.

## MCP 클라이언트에서 연결

### Claude Desktop (mcp-remote 사용)

`claude_desktop_config.json` 예시:

```json
{
  "mcpServers": {
    "bmad-quick-spec": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp-bmad-quick-spec.<계정명>.workers.dev/mcp"
      ]
    }
  }
}
```

커스텀 도메인을 쓴 경우 위 URL을 `https://mcp.yourdomain.com/mcp` 로 바꾸면 됩니다.

## 기술 스택

- **Runtime**: Cloudflare Workers (Durable Objects)
- **MCP**: [Model Context Protocol](https://modelcontextprotocol.io/) — Streamable HTTP
- **패키지**: `agents` (Cloudflare), `zod`
