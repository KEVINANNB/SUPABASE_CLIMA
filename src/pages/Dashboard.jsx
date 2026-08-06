import React, { useEffect, useState } from 'react';
import { getSensorData } from '../api/supabase';
import WeatherCards from '../components/WeatherCards';

const REFRESCO_MS = 30000; // refresca cada 30s

const Dashboard = () => {
  const [historico, setHistorico] = useState([]);
  const [actual, setActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const datos = await getSensorData(20);
      if (datos.length > 0) {
        setHistorico(datos);
        setActual(datos[0]); // el registro más reciente
        setError(false);
      } else {
        setError(true);
      }
      setCargando(false);
    };

    fetchData();
    const intervalo = setInterval(fetchData, REFRESCO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="contenedor">
      <h1>Estación Meteorológica</h1>

      {error && !cargando && (
        <p className="aviso">
          No se pudieron cargar datos desde Supabase. Verifica la tabla
          <code> datos_sensor</code> y las variables de entorno.
        </p>
      )}

      <WeatherCards data={actual} />

      <h3 className="subtitulo">Historial de Lecturas</h3>
      <div className="tabla-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Sensor</th>
              <th>Temp (°C)</th>
              <th>Presión (hPa)</th>
              <th>Humedad (%)</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((registro) => (
              <tr key={registro.id ?? `${registro.id_sensor}-${registro.created_at}`}>
                <td>{new Date(registro.created_at).toLocaleString('es-EC')}</td>
                <td>#{registro.id_sensor}</td>
                <td>{registro.temp}</td>
                <td>{registro.presion}</td>
                <td>{registro.humedad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
