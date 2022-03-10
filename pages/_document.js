import { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'

export default function Document() {
  return (
    <Html data-theme="night">
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@2.6.3/dist/full.css" rel="stylesheet" type="text/css" />
        <script async src="https://cdn.tailwindcss.com" />
      </Head>
      <body>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" passHref>
              <a className="btn btn-ghost normal-case text-xl">API playground</a>
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li>
                <a href="https://github.com/LicenseRocks/ch-playground" target="_blank" rel="noreferrer">
                  Github code
                </a>
              </li>
              <li>
                <a href="https://github.com/LicenseRocks/ch-docs" target="_blank" rel="noreferrer">
                  Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
