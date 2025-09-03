import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Lanka Tender - Sri Lankan Government Tender Portal",
  description = "Access daily Sri Lankan government tenders from multiple newspapers. Get alerts, search archives, and stay informed about business opportunities in Sri Lanka.",
  keywords = ["sri lanka tenders", "government tenders", "business opportunities", "procurement", "bids", "contracts"],
  ogImage = "/logo.png",
  ogType = "website",
  canonicalUrl,
  structuredData
}) => {
  const fullTitle = title === "Lanka Tender - Sri Lankan Government Tender Portal" 
    ? title 
    : `${title} | Lanka Tender`;

  const currentUrl = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Lanka Tender" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `https://lankatender.com${ogImage}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Lanka Tender" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lankatender" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `https://lankatender.com${ogImage}`} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="application-name" content="Lanka Tender" />
      <meta name="apple-mobile-web-app-title" content="Lanka Tender" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;