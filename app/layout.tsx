import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {title: "Agora — Portfolio Showcase", description: "An independent frontend sample using fictional market data."};

export default function Layout({children}: {children: React.ReactNode}) {

  return <html lang="en"><body><a className="skip" href="#main">Skip to content</a>{children}</body></html>;

}

