import Head from "next/head"

type SeoProps = {
  title?: string
  description?: string
  keywords?: string
}

export default function Seo({
  title = "REDONDO",
  description = "",
  keywords = "",
}: SeoProps) {

  const fullTitle = `REDONDO | ${title}`

  return (
    <Head>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  )
}