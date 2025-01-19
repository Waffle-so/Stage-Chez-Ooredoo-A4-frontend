import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import style from '../../styles/Dashbord.module.css';
const LineChartComponent = ({ userData }) => {
  const [sectorData, setSectorData] = useState([]);
  const [filterType, setFilterType] = useState('Nbr_Connexion'); // Filtre sur le type de données (Connexion, fichier, vidéo)
  const [selectedSector, setSelectedSector] = useState(''); // Filtre par secteur

  useEffect(() => {
    // Regrouper les données par secteur et calculer les totaux
    const groupedData = userData.reduce((acc, user) => {
      if (!acc[user.secteur]) {
        acc[user.secteur] = {
          secteur: user.secteur,
          Nbr_Connexion: 0,
          Nbr_add_file: 0,
          Nbr_add_video: 0,
        };
      }
      acc[user.secteur].Nbr_Connexion += user.Nbr_Connexion || 0;
      acc[user.secteur].Nbr_add_file += user.Nbr_add_file || 0;
      acc[user.secteur].Nbr_add_video += user.Nbr_add_video || 0;
      return acc;
    }, {});

    // Transformer l'objet en tableau
    const dataArray = Object.values(groupedData);

    setSectorData(dataArray);

    // Initialiser le filtre secteur avec le premier secteur disponible
    if (dataArray.length > 0 && !selectedSector) {
      setSelectedSector(dataArray[0].secteur);
    }
  }, [userData]);

  const handleChangeFilterType = (event) => {
    setFilterType(event.target.value);
  };

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };

  return (
    <div>
        <div className={style.flexing_filter} >
              {/* Menu déroulant pour filtrer par type de données */}
      <label htmlFor="data-type"> </label>
      <select id="data-type" value={filterType} onChange={handleChangeFilterType}>
        <option value="Nbr_Connexion"> Nombre de Connexions </option>
        <option value="Nbr_add_file">Fichiers ajoutés</option>
        <option value="Nbr_add_video">Vidéos ajoutées</option>
      </select>

      {/* Menu déroulant pour filtrer par secteur */}
      <label htmlFor="sector-type"> </label>
      <select id="sector-type" value={selectedSector} onChange={handleSectorChange}>
        {sectorData.map((sector) => (
          <option key={sector.secteur} value={sector.secteur}>
            {sector.secteur}
          </option>
        ))}
      </select>
        </div>
    

      {sectorData.length > 0 ? (
        <>
        <section> {/* Affichage du graphique en ligne */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={sectorData}
              margin={{ top: 10, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="secteur" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={filterType}
                stroke="#0088FE"
                name={
                  filterType === 'Nbr_Connexion'
                    ? 'Connexions'
                    : filterType === 'Nbr_add_file'
                    ? 'Fichiers ajoutés'
                    : 'Vidéos ajoutées'
                }
              />
            </LineChart>
          </ResponsiveContainer> </section>
         

          <article>
  <section>
    <ul>
      {sectorData
        .filter((sector) => sector.secteur === selectedSector)
        .map((sector, index) => (
          <li key={index} style={{ marginBottom: '20px' }}>
            {/* Graphique amélioré */}
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[sector]}
                barCategoryGap="30%" // Espacement des barres
                barSize={40} // Largeur des barres
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ccc"
                  vertical={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 14 }}
                  axisLine={{ stroke: '#888' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#888' }}
                  tickLine={false}
                  type="category" dataKey="secteur" 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '15px' }}
                />
                <Legend
                  wrapperStyle={{ bottom: 0, fontSize: '14px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="Nbr_Connexion"
                  fill="#0088FE"
                  radius={[0, 0, 0, 0]} // Coins arrondis
                  name="Connexions"
                />
                <Bar
                  dataKey="Nbr_add_file"
                  fill="#00C49F"
                  radius={[0, 0, 0, 0]} // Coins arrondis
                  name="Fichiers ajoutés"
                />
                <Bar
                  dataKey="Nbr_add_video"
                  fill="#FFBB28"
                  radius={[0, 0, 0, 0]} // Coins arrondis
                  name="Vidéos ajoutées"
                />
              </BarChart>
            </ResponsiveContainer>
          </li>
        ))}
    </ul>
  </section>
</article>

        </>
      ) : (
        <p>Aucune donnée disponible.</p>
      )}
    </div>
  );
};

export default LineChartComponent;
