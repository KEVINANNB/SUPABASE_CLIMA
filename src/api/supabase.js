const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Obtiene las últimas lecturas de la tabla `datos_sensor` en Supabase,
 * ordenadas de la más reciente a la más antigua.
 * @param {number} limit cantidad de registros a traer (por defecto 20)
 */
export const getSensorData = async (limit = 20) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
      'Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env'
    );
    return [];
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/datos_sensor?select=*&order=created_at.desc&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase REST error:', response.status, errorText);
      throw new Error('Error al obtener datos de Supabase');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
