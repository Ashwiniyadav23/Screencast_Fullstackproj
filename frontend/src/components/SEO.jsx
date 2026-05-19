import { Helmet } from "react-helmet-async";

const SITE_NAME = "ScreenCast Pro";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://screen-cast-proj-frontend.vercel.app").replace(/\/+$/, "");
const DEFAULT_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  keywords,
  noindex = false,
}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}

      <link rel="canonical" href={canonical} />

      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
