let cachedApp = null;
let initError = null;

export default async function handler(req, res) {
  if (!cachedApp && !initError) {
    try {
      await import('../server/src/models/index.js');
      const mod = await import('../server/src/app.js');
      cachedApp = mod.default;
    } catch (err) {
      console.error('Serverless init error:', err);
      initError = err;
    }
  }

  if (initError) {
    return res.status(500).json({
      error: 'SERVERLESS_INIT_FAILED',
      message: initError.message,
      code: initError.code,
      stack: initError.stack,
    });
  }

  return cachedApp(req, res);
}
