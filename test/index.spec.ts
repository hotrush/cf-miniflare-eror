// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { Miniflare } from 'miniflare';
import worker from '../src/index';
// import * as fs from 'fs';
// import path from 'path';

const mf = new Miniflare({
	modules: true,
	scriptPath: '../src/index.ts',
	r2Buckets: ['R2_BUCKET'],
});

// This code doesn't affect since error happens before
// const b = await mf.getR2Bucket('R2_BUCKET');
// await b.put('source-image.png', fs.readFileSync(path.resolve(__dirname, './test-image.jpg')))

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});
});
