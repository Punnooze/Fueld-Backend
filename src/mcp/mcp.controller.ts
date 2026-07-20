import { All, Controller, Req, Res } from '@nestjs/common';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Request, Response } from 'express';
import { McpService } from './mcp.service';

// Stateless streamable-HTTP MCP endpoint at /mcp. Each POST spins up a fresh
// server+transport, handles the request, then tears down. GET/DELETE (SSE
// resumption) aren't supported in stateless mode → 405.
@Controller('mcp')
export class McpController {
  constructor(private readonly mcp: McpService) {}

  @All()
  async handle(@Req() req: Request, @Res() res: Response) {
    if (req.method !== 'POST') {
      res.status(405).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed.' },
        id: null,
      });
      return;
    }
    const server = this.mcp.createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      void transport.close();
      void server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }
}
