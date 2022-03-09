import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html data-theme="night">
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@2.6.3/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com" />
      </Head>
      <body>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">API playground</a>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li><a>Github code</a></li>
              <li><a>Docs</a></li>
            </ul>
          </div>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
