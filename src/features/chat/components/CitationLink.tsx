interface CitationLinkProps {
  citationNumber: number
  href: string
  title: string
}

function getSourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(
      /^www\./,
      "",
    )
  } catch {
    return url
  }
}

export function CitationLink({
  citationNumber,
  href,
  title,
}: CitationLinkProps) {
  return (
    <span className="citation-wrapper">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="citation-link"
        aria-label={`Open source ${citationNumber}: ${title}`}
      >
        [{citationNumber}]
      </a>

      <span
        className="citation-tooltip"
        role="tooltip"
      >
        <strong className="citation-tooltip-title">
          Source {citationNumber}: {title}
        </strong>

        <span className="citation-tooltip-host">
          {getSourceHost(href)}
        </span>

        <span className="citation-tooltip-hint">
          Click to open source
        </span>
      </span>
    </span>
  )
}