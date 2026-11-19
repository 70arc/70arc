import { site } from "@content/site";
import { Icon } from "@/components/icon";
import { Container, Section } from "@/components/section";
import { SocialIcon } from "@/components/social-icon";
import { pageMeta } from "@/lib/seo";

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
        <ul className="contact-list">
          {site.social.map((item, index) => (
            <li key={item.id} data-reveal="" data-stagger={index + 2}>
              <a className="contact-row" href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="contact-icon">
                  <SocialIcon name={item.icon} />
                </span>
                <span className="contact-copy">
                  <span className="contact-network">{item.label}</span>
                  {item.handle ? <span className="contact-handle">{item.handle}</span> : null}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <Icon name="arrow-up-right" />
              </a>
            </li>
          ))}
        </ul>
        <div className="contact-place" data-reveal="" data-stagger={site.social.length + 2}>
          <p className="caption">{site.contact.locationLabel}</p>
          <p>{site.contact.based}</p>
        </div>
      </Container>
    </Section>
  );
}
