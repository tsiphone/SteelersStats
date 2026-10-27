import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('http://localhost:8000/api/steelers')
      .then((res) => res.json())
      .then((records) => {
        setData(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al consultar FastAPI:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Cargando estadísticas desde FastAPI...</div>;
  }

  const categories = ['all', ...new Set(data.map((item) => item.category))];
  const filteredData = selectedCategory === 'all'
    ? data
    : data.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Pittsburgh Steelers — Stats Season</h1>
      
      {/* Selector de categorías */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Filter Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '0.4rem', fontSize: '1rem' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

    
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffb612', color: '#101820' }}>
            <th>Team</th>
            <th>Category</th>
            <th>Metrics</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td>{row.team}</td>
              <td>{row.category}</td>
              <td>{row.label}</td>
              <td style={{ fontWeight: 'bold' }}>{row.display_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}