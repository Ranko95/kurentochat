import next from 'next';
import express from 'express';
import { parse } from 'url';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`> Ready on port ${port} [${process.env.NODE_ENV}]`);
  });
});
