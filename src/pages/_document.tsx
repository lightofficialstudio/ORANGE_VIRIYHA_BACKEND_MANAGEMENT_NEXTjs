import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#2296f3" />
        <meta name="title" content="วิริยะ - ระบบจัดการหลังบ้านวิริยะ" />
        <meta name="description" content="วิริยะ - ระบบจัดการหลังบ้านวิริยะ" />
        <meta name="keywords" content="วิริยะ - ระบบจัดการหลังบ้านวิริยะ" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://berrydashboard.io/" />
        <meta property="og:site_name" content="berrydashboard.io" />
        <meta property="article:publisher" content="https://www.facebook.com/codedthemes" />
        <meta property="og:title" content="วิริยะ - ระบบจัดการหลังบ้านวิริยะ" />
        <meta property="og:description" content="ระบบจัดการหลังบ้านวิริยะ." />
        <meta property="og:image" content="https://berrydashboard.io/og-image/og-facebook.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://berrydashboard.io" />
        <meta property="twitter:title" content="วิริยะ - ระบบจัดการหลังบ้านวิริย" />
        <meta property="twitter:description" content="วิริยะ - ระบบจัดการหลังบ้านวิริยะ" />
        <meta property="twitter:image" content="https://berrydashboard.io/og-image/og-twitter.png" />
        <meta name="twitter:creator" content="@codedthemes" />

        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
