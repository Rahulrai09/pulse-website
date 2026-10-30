// Junk URLs that Pulse never published (old spam / previous-domain paths).
// Answer "410 Gone" so search engines drop them for good. Runs only on the matcher paths in vercel.json.
export default function proxy() {
  return new Response('410 Gone: this page does not exist on pulseio.in.', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'public, max-age=86400' },
  });
}
