import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { checkoutSessionSchema } from '../src/schemas/donation.schemas';
import { getAllowedOrigins, isAllowedOrigin } from '../src/config/security';

const originalEnvironment = {
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  FRONTEND_URLS: process.env.FRONTEND_URLS,
  SERVE_FRONTEND: process.env.SERVE_FRONTEND,
  RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
};

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  delete process.env.FRONTEND_URL;
  delete process.env.FRONTEND_URLS;
  delete process.env.SERVE_FRONTEND;
  delete process.env.RENDER_EXTERNAL_URL;
});

after(() => {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('CORS accepts only exact configured origins', () => {
  process.env.FRONTEND_URLS = 'https://anime.example, https://admin.anime.example/';

  assert.deepEqual(getAllowedOrigins(), [
    'https://anime.example',
    'https://admin.anime.example',
  ]);
  assert.equal(isAllowedOrigin('https://anime.example'), true);
  assert.equal(isAllowedOrigin('https://evil.example'), false);
});

test('production requires an explicit frontend origin', () => {
  process.env.NODE_ENV = 'production';
  assert.throws(() => getAllowedOrigins(), /must be configured/);
});

test('combined Render deployment uses its exact platform-provided origin', () => {
  process.env.NODE_ENV = 'production';
  process.env.SERVE_FRONTEND = 'true';
  process.env.RENDER_EXTERNAL_URL = 'https://demo.onrender.com';
  assert.deepEqual(getAllowedOrigins(), ['https://demo.onrender.com']);
  assert.equal(isAllowedOrigin('https://other.onrender.com'), false);
  process.env.FRONTEND_URL = 'https://explicit.example';
  assert.deepEqual(getAllowedOrigins(), ['https://explicit.example']);
});

test('donation input enforces amount and text limits', () => {
  assert.equal(checkoutSessionSchema.parse({ amount: 3 }).amount, 3);
  assert.throws(() => checkoutSessionSchema.parse({ amount: 0 }));
  assert.throws(() => checkoutSessionSchema.parse({ amount: 1001 }));
  assert.throws(() => checkoutSessionSchema.parse({ amount: 1.001 }));
  assert.throws(() => checkoutSessionSchema.parse({ amount: 3, admin: true }));
});
