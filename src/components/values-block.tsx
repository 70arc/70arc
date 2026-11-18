import { site } from "@content/site";

export function ValuesBlock() {
  return (
    <div>
      <p className="label reveal">{site.values.eyebrow}</p>
      <h2 id="values-title" className="display reveal">{site.values.title}</h2>
      <div className="values">
        {site.values.items.map((item) => (
          <article className="card reveal" key={item.title}>
            <h3>{item.title}</h3>
            <p className="card-copy">{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
