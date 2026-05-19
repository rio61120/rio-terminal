import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">404</h1>
          <Link href="/en" className="mt-4 inline-block text-violet-400 hover:underline">
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
