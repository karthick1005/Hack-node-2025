export default function FooterColumn({ title, links }) {
  return (
    <div>
      <div className="font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-gray-600">
        {links.map((link, idx) => (
          <li key={idx}>
            <a href={link.href} className="hover:text-sky-600">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
