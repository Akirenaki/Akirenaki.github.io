import { useId } from "react";

export function InfoTooltip({ children, content }) {
  const tooltipId = `tooltip-${useId().replaceAll(":", "")}`;

  return (
    <span className="info-tooltip">
      <span className="info-tooltip-trigger" tabIndex="0" aria-describedby={tooltipId}>
        {children}
      </span>
      <span id={tooltipId} className="info-tooltip-content" role="tooltip">
        {content}
      </span>
    </span>
  );
}
