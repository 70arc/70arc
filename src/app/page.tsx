import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { ApproachTrack } from "@/components/approach-track";
import { Arrow } from "@/components/arrow";
import { HeroCube } from "@/components/art";
import { ProductCard } from "@/components/product-card";
import { ValuesBlock } from "@/components/values-block";

export default function HomePage() {
  const words = site.mission.split(" ");
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="label hero-eyebrow">{site.hero.eyebrow}</p>
            <h1>
              <span className="line"><span>Practical AI,</span></span>
              <span className="line"><span>built into products people use.</span></span>
            </h1>
            <p className="lede hero-sub">{site.hero.subhead}</p>
            <div className="actions">
              <Link className="btn" href="/#products">
                {site.hero.primary}
                <Arrow />
              </Link>
            </div>
          </div>
          <HeroCube />
        </div>
      </section>
      <section className="section sunken">
        <div className="container">
          <h2 className="display mission">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                {index > 0 ? " " : null}
                <span className="scrub-word">{word}</span>
              </span>
            ))}
          </h2>
        </div>
      </section>
      <section className="section" id="products" aria-labelledby="products-title">
        <div className="container">
          <p className="label reveal">{site.productsSection.eyebrow}</p>
          <h2 id="products-title" className="display reveal">{site.productsSection.title}</h2>
          <p className="lede measure reveal">{site.productsSection.subhead}</p>
          <div className="cards">
            {publishedProducts().map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
      <section className="section night" aria-labelledby="featured-title">
        <div className="container">
          <p className="label reveal">{site.featured.eyebrow}</p>
          <h2 id="featured-title" className="display reveal">{site.featured.title}</h2>
          <div className="columns-3">
            {site.featured.items.map((item) => (
              <article className="reveal" key={item.number}>
                <p className="num">{item.number}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section approach" id="approach" aria-labelledby="approach-title">
        <div className="container">
          <p className="label reveal">{site.approach.eyebrow}</p>
          <h2 id="approach-title" className="display reveal">{site.approach.title}</h2>
          <div className="timeline">
            <ApproachTrack />
            <ol>
              {site.approach.steps.map((step, index) => (
                <li className="reveal" key={step.title}>
                  <p className="num">{index + 1}</p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="section sunken" aria-labelledby="values-title">
        <div className="container">
          <ValuesBlock />
        </div>
      </section>
    </>
  );
}
