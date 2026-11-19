import { site } from "@content/site";
import { Icon } from "@/components/icon";
import { Container, Section } from "@/components/section";
import { SocialIcon } from "@/components/social-icon";
import { pageMeta } from "@/lib/seo";
import styles from "./contact.module.css";

export const metadata = pageMeta(`${site.contact.title.replace(".", "")} | ${site.name}`, site.contact.description);

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <header className="page-intro">
          <h1 tabIndex={-1} data-reveal="">
            {site.contact.title}
          </h1>
          <p className="lede" data-reveal="" data-stagger="1">
            {site.contact.intro}
          </p>
        </header>
        <ul className={styles.list}>
          {site.social.map((item, index) => (
            <li key={item.id} data-reveal="" data-stagger={index + 2}>
              <a className={styles.row} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.aria}>
                <span className={styles.icon}>
                  <SocialIcon name={item.icon} />
                </span>
                <span className={styles.copy}>
                  <span className={styles.network}>{item.label}</span>
                  {item.handle ? <span className={styles.handle}>{item.handle}</span> : null}
                </span>
                <Icon name="arrow-up-right" />
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.place} data-reveal="" data-stagger={site.social.length + 2}>
          <p className="caption">{site.contact.locationLabel}</p>
          <p>{site.contact.based}</p>
        </div>
      </Container>
    </Section>
  );
}
