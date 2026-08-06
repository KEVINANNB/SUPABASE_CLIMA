import React from 'react';

const WeatherCards = ({ data }) => {
  if (!data) return <p className="cargando">Cargando datos del sensor...</p>;

  return (
    <div className="cards">
      <div className="card">
        <h3>Temperatura</h3>
        <p className="valor">{data.temp} °C</p>
      </div>
      <div className="card">
        <h3>Presión</h3>
        <p className="valor">{data.presion} hPa</p>
      </div>
      <div className="card">
        <h3>Humedad</h3>
        <p className="valor">{data.humedad} %</p>
      </div>
      <div className="card">
        <h3>Sensor</h3>
        <p className="valor">#{data.id_sensor}</p>
      </div>
    </div>
  );
};

export default WeatherCards;
