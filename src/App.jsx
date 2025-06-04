import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [registros, setRegistros] = useState([]);

  // Obtener historial al cargar la página
  useEffect(() => {
    fetch('https://nube-backend.vercel.app/api/registro')
      .then((res) => res.json())
      .then((data) => setRegistros(data))
      .catch((err) => console.error('Error al obtener registros:', err));
  }, []);

  // Escuchar teclas y enviar al backend
  useEffect(() => {
    const manejarTecla = (e) => {
      const now = new Date().toLocaleString();
      let direccion = '';

      switch (e.key) {
        case 'ArrowUp':
          direccion = 'Arriba';
          break;
        case 'ArrowDown':
          direccion = 'Abajo';
          break;
        case 'ArrowLeft':
          direccion = 'Izquierda';
          break;
        case 'ArrowRight':
          direccion = 'Derecha';
          break;
        default:
          return; // ignorar otras teclas
      }

      const nuevoRegistro = { direccion, hora: now };

      // Enviar al backend
      fetch('https://nube-backend.vercel.app/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRegistro),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al enviar registro');
          // Actualizar estado local
          setRegistros((prev) => [nuevoRegistro, ...prev]);
        })
        .catch((err) => console.error(err));
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, []);

  return (
    <div className="contenedor">
      <h2>Historial de acciones</h2>
      <table>
        <thead>
          <tr>
            <th>Flecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td>{registro.direccion}</td>
              <td>{registro.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;



