import style from '../../styles/Logs.module.css';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Log_Page({ username, userprenom, userIdd, user_role }) {
    const [logs, setLogs] = useState([]);
    const [startDate_log, setStartDate_log] = useState(''); // Date de début
    const [endDate_log, setEndDate_log] = useState(''); // Date de fin
    const [filteredLogs, setFilteredLogs] = useState([]); // Logs filtrés
    const [logSearchQuery, setLogSearchQuery] = useState('');

    useEffect(() => {
        if (userIdd) {
          fetchLogs();
        }
      }, [userIdd]);


     // Fonction pour récupérer les logs
 const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé');
        router.push('../Login/Login');
        return;
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/logs`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Ajouter le token dans les en-têtes
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        const logs = response.data.logs.split('\n'); // Diviser les logs ligne par ligne
        //console.log('Logs récupérés :', logs);
        setLogs(logs);  // Stocker les logs dans l'état
      } else {
        console.error('Erreur lors de la récupération des logs:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };




  // Fonction pour convertir la date dans le format 'YYYY-MM-DD'
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.error('Date invalide :', date);
      return ''; // Retourne une chaîne vide en cas de date invalide
    }
    return parsedDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
  };
  


   // Filtrer les logs en fonction de la plage de dates
   const filterLogsByDate = () => {
    const filtered = logs.filter((log) => {
      const [timestamp] = log.split(' '); // Supposons que la première partie est la date
      const logDate = formatDate(timestamp); // Extraire la date du log

      const isAfterStartDate = startDate_log ? logDate >= startDate_log : true;
      const isBeforeEndDate = endDate_log ? logDate <= endDate_log : true;
      
         // Filtrer par contenu du message si une recherche est active
    const matchesSearchQuery = logSearchQuery
    ? log.toLowerCase().includes(logSearchQuery.toLowerCase())
    : true;


      return isAfterStartDate && isBeforeEndDate && matchesSearchQuery;
    });
    setFilteredLogs(filtered); // Mettre à jour les logs filtrés
  };

  // Utiliser useEffect pour appliquer le filtrage lorsque les dates changent
  useEffect(() => {
    filterLogsByDate();
  }, [startDate_log, endDate_log, logs, logSearchQuery]);

  
    return(
        <>
        <div className={style.div_all_log}>
        {user_role === 'Administrateur' && (
            <div>
                <h1> Liste des logs </h1>

                <div className={style.div_dateInput_log}>
          <label>
            De :
            <input
              type="date"
              value={startDate_log}
              onChange={(e) => setStartDate_log(e.target.value)}
              className={style.dateInput}
            />
          </label>
          <label>
            À :
            <input
              type="date"
              value={endDate_log}
              onChange={(e) => setEndDate_log(e.target.value)}
              className={style.dateInput}
            />
          </label>
           {/* Barre de recherche */}
  <input
    type="text"
    placeholder="Rechercher dans les logs..."
    value={logSearchQuery}
    onChange={(e) => setLogSearchQuery(e.target.value)}
    className={style.searchInput}
  />
        </div>

        <br/>
      <div className={style.table_container_logs}>



      <table className={style.table_logs}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Message</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => {
            const [timestamp, level, ...message] = log.split(' ');
            return (
              <tr key={index}>
                <td >{timestamp}</td>
                <td>{level}</td>
                <td>{message.join(' ')}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

            </div>
        ) }
        </div>
        </>
    )
}