// SEO utility functions for structured data generation

export interface TenderStructuredData {
  "@context": string;
  "@type": string;
  "name": string;
  "description": string;
  "url": string;
  "datePosted": string;
  "validThrough": string;
  "hiringOrganization": {
    "@type": string;
    "name": string;
    "sameAs"?: string;
  };
  "jobLocation": {
    "@type": string;
    "address": {
      "@type": string;
      "addressRegion": string;
      "addressCountry": string;
    };
  };
  "baseSalary"?: {
    "@type": string;
    "currency": string;
    "value": {
      "@type": string;
      "minValue": number;
    };
  };
}

export const generateTenderStructuredData = (tender: any): TenderStructuredData => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "name": tender.title,
    "description": tender.description || tender.fullTextMarkdown?.substring(0, 200) || "Government tender opportunity in Sri Lanka",
    "url": `https://lankatender.com/tenders/${tender._id}`,
    "datePosted": tender.dates?.published,
    "validThrough": tender.dates?.closing,
    "hiringOrganization": {
      "@type": "Organization",
      "name": tender.organization?.name || "Government of Sri Lanka"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": tender.location?.province || "Sri Lanka",
        "addressCountry": "LK"
      }
    },
    ...(tender.financials?.estimatedValue?.amount && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": tender.financials.estimatedValue.currency || "LKR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": tender.financials.estimatedValue.amount
        }
      }
    })
  };
};

export const generateWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Lanka Tender",
    "url": "https://lankatender.com",
    "description": "Sri Lanka's premier government tender portal",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://lankatender.com/tenders?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};