function ResourcePanel({ resources }) {
  if (!resources || resources.length === 0) return null;

  const grouped = resources.reduce((acc, r) => {
    const cat = r.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="resource-panel">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="resource-group">
          <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
          <ul>
            {items.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ResourcePanel;
