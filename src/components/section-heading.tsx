import styles from "./section-heading.module.css";

export function SectionHeading({
  id,
  titleId,
  eyebrow,
  title,
  lede,
}: {
  id?: string;
  titleId: string;
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header id={id} className={styles.heading}>
      {eyebrow ? (
        <p className="eyebrow" data-reveal="" data-stagger="0">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={titleId} data-reveal="" data-stagger="1">
        {title}
      </h2>
      {lede ? (
        <p className="lede" data-reveal="" data-stagger="2">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
