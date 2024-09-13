import { Transform } from 'stream';
import { MyContext } from '../types/controller';

export class SseController {
  ctx: MyContext;
  stream: SSEStream | null = null;
  constructor(ctx: MyContext) {
    this.ctx = ctx;
  }
  init() {
    const { ctx } = this;
    ctx.req.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // 'Keep-Alive': 'timeout=120',
      'X-Accel-Buffering': 'no',
    });

    const stream = new SSEStream();
    this.stream = stream;

    ctx.status = 200;
    stream.pipe(ctx.res);
  }

  send(data: any) {
    this.stream?.write(data);
  }

  end() {
    this.stream?.end();
  }
}

class SSEStream extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
    });
  }

  _transform(data: any, _encoding: string, done: () => void) {
    this.push(`data: ${JSON.stringify({ data })}\n\n`);
    done();
  }
}
