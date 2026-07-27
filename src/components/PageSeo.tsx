import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '../lib/api';

const cache: Record<string, any> = {};

interface Props {
  pageKey?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default function PageSeo({ pageKey, fallbackTitle, fallbackDescription }: Props) {
  const [seo, setSeo] = useState<any>(pageKey ? cache[pageKey] || null : null);

  useEffect(() => {
    if (!pageKey) { setSeo(null); return; }
    if (cache[pageKey]) { setSeo(cache[pageKey]); return; }
    fetch(`${API_BASE}/seo/${pageKey}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) { cache[pageKey] = data; setSeo(data); } })
      .catch(() => {});
  }, [pageKey]);

  const title = seo?.meta_title || fallbackTitle || 'Bioclinica';
  const description = seo?.meta_description || fallbackDescription || '';
  const ogTitle = seo?.og_title || title;
  const ogDesc = seo?.og_description || description;
  const ogImage = seo?.og_image || '';
  const canonical = seo?.canonical_url || '';

  return (
    // @ts-ignore
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={ogTitle} />
      {ogDesc && <meta property="og:description" content={ogDesc} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
