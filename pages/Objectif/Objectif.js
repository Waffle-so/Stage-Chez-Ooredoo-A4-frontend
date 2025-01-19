import style from '../../styles/Objectif.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import router from 'next/router';

export default function Objectif({username,userprenom,userIdd,user_role,usersecteur}){

const [filteredProjets, setFilteredProjets] = useState([]); 
const [allProjetsChefSection, setAllProjetsChefSection] = useState([]); // Liste complète

const [allProjetAsso, setAllProjetAsso] = useState([]);
const [projet_asso, setprojet_asso] = useState([]);

const [allusers, setAllUsers] = useState([]); 
const [Objectifs,setObjectifs]=useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [dateFilter, setDateFilter] = useState('all');
const [activeFilter, setActiveFilter] = useState('all'); // "all" est le filtre par défaut



useEffect(() => {
    if (userIdd && user_role==='Chef de section') {
        fetchAllProjets();
        fetch_all_objectifs();
    }
    if(userIdd && user_role==='Chef de projet' || user_role==='Employée'){
        fetchAllProjets_associeted();
        fetchAllUsers_for_others();
        fetch_all_objectifs();
    }
}, [userIdd]);


 const [pagee,setpagee]=useState('');
    const navigate = (pageName, params = {}) => {
      setpagee(pageName + ' >');
      localStorage.setItem('currentPage', pageName);
      
      router.push({
        pathname: `/Page_One_For_All`,
        query: { page: pageName, ...params }, 
      }, undefined, { shallow: true });
    };

    const handleVideoClick = (id,nomprojet,Description_proj) => {
         // Appel de navigate avec les paramètres
      navigate('Objectif2', {
        id: id,
        nom: nomprojet,
        Description: Description_proj,
        userIdd: userIdd,
      }); 
    };
    

const fetchAllUsers_for_others = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login/Login');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/get_all_employee`,
            { usersecteur },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            const users = response.data.Users;
            setAllUsers(users);
            setFilteredUsers2(users); // Initialiser `filteredUsers` avec les utilisateurs récupérés
            console.log('Détails de tous les utilisateurs récupérés avec succès');
        } else {
            console.error('Erreur lors de la récupération des détails des utilisateurs');
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
};



const fetch_all_objectifs = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_obj_all`,{},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            const objectifs = response.data.objectifs;
            console.log('tout objectifs ici  :',objectifs)
            setObjectifs(objectifs);
            console.log('Détails de tous les objectifs récupérés avec succès');
        } else {
            console.error('Erreur lors de la récupération des détails des objectifs');
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
};
    const fetchAllProjets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_projet`,
                {usersecteur},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const projets = response.data.Projet;
                setAllProjetsChefSection(projets); // Liste source complète
                setFilteredProjets(projets);  // Initialiser les projets filtrés avec tous les projets
                console.log('Détails de tous les projets récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails des projets');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
    };

    const fetchAllProjets_associeted = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }
      
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_projet_associer`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
      
            if (response.data.success) {
                const projets = response.data.projets;
                //console.log('asso proj',projets);
                setAllProjetAsso(projets); // Projets originaux
                setprojet_asso(projets);  // Projets affichés
                
                console.log('Détails de tous les projets associé ont été récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails des projets associé ');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
      };
      
     
      const [currentPage2, setCurrentPage2] = useState(1);
      const projetperpage = 9;
      const indexOfLastprojet2 = currentPage2 * projetperpage;
const indexOfFirstprojet2 = indexOfLastprojet2 - projetperpage;

const currentprojet2 = projet_asso.slice(indexOfFirstprojet2, indexOfLastprojet2);
const totalPages_projet2 = Math.ceil(projet_asso.length / projetperpage);


const handlePageChange2 = (page) => {
    setCurrentPage2(page);
};





const [currentPage, setCurrentPage] = useState(1);
const indexOfLastprojet = currentPage * projetperpage;
const indexOfFirstprojet = indexOfLastprojet - projetperpage;

const currentprojet = filteredProjets.slice(indexOfFirstprojet, indexOfLastprojet);
const totalPages_projet = Math.ceil(filteredProjets.length / projetperpage);


const handlePageChange = (page) => {
    setCurrentPage(page);
};
    // Fonction pour obtenir un chemin d'image nettoyé
    const getCleanedImagePath = (imagePath) => {
        if (!imagePath) return '';
        const imageName = imagePath.split(/[/\\]/).pop(); // Obtenez uniquement le nom du fichier
        const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, ''); // Nettoyez le chemin
        return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;
    };
    
      console.log('filteredProjets : ',filteredProjets)



      
      const getProgression = (id_projet) => {
        // Filtrer les objectifs associés au projet
        const objectifsAssocies = Objectifs.filter(obj => obj.id_Projet === id_projet);
      
        if (objectifsAssocies.length === 0) return 0; // Retourner 0 si aucun objectif n'est associé
      
        // Compter le nombre d'objectifs terminés
        const objectifsTermines = objectifsAssocies.filter(obj => obj.Terminer === true).length;
      
        // Calculer la progression en pourcentage
        const progression = (objectifsTermines / objectifsAssocies.length) * 100;
      
        return progression.toFixed(2); // Retourner une valeur numérique
      };
      

      // Gestion de la recherche
const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
};
    
    
const filterByDate = (projects, filter) => {
    if (filter === 'all') return projects; // Restaurer tous les projets
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (filter) {
        case 'week':
            return projects.filter(projet => new Date(projet.createdAt) >= startOfWeek);
        case 'month':
            return projects.filter(projet => new Date(projet.createdAt) >= startOfMonth);
        case 'year':
            return projects.filter(projet => new Date(projet.createdAt) >= startOfYear);
        default:
            return projects;
    }
};

     // Gestion du changement de filtre par date
     const handleDateFilterChange = (filter) => {
        setActiveFilter(filter); // Définir le filtre actif
        setDateFilter(filter);
    };
    
            // Fonction pour appliquer les filtres combinés
            const applyFilters = () => {
                let filtered = user_role === 'Chef de section' ? [...allProjetsChefSection] : [...allProjetAsso];
            
                // Appliquer la recherche
                if (searchQuery) {
                    filtered = filtered.filter(projet =>
                        projet.Nom_projet.toLowerCase().includes(searchQuery) ||
                        projet.Description.toLowerCase().includes(searchQuery)
                    );
                }
            
                // Appliquer le filtre par date
                filtered = filterByDate(filtered, dateFilter);
            
                // Mettre à jour les projets filtrés
                if (user_role === 'Chef de section') {
                    setFilteredProjets(filtered);
                } else {
                    setprojet_asso(filtered);
                }
            
                // Réinitialiser la pagination
                setCurrentPage(1);
                setCurrentPage2(1);
            };
            


// Appliquer les filtres à chaque changement
useEffect(() => {
    applyFilters();
}, [searchQuery, dateFilter, allProjetAsso,allProjetsChefSection]);



    return(
        <>
        <div className={style.Div_all_obj}>

            <div className={style.header}>
             <input type='text' 
             className={style.input_recherche} 
             placeholder='Chercher ce que vous voulez...'
             onChange={handleSearch}
              />

             <div className={style.container}>
             <button> <strong>Filtrer</strong> par projet <strong>☰</strong> </button>
             <div className={style.filtre}>
             <a onClick={() => handleDateFilterChange('week')}   className={activeFilter === 'week' ? style.activeFilter : ''}>Cette semaine</a>
  <a onClick={() => handleDateFilterChange('month')}   className={activeFilter === 'month' ? style.activeFilter : ''}>Ce mois-ci</a>
  <a onClick={() => handleDateFilterChange('year')}   className={activeFilter === 'month' ? style.activeFilter : ''}>Cette année</a>
  <a onClick={() => handleDateFilterChange('all')}   className={activeFilter === 'month' ? style.activeFilter : ''}>Tous les projets</a>
             </div>
                </div>

                {/* <button className={style.btn_ajn}> + </button>*/}
            </div>
            <h3 className={style.titre}> Liste des projets</h3>




{user_role==='Chef de section' &&(
    <>

<div className={style.div_bas}>
            {currentprojet.map((projet, index) => {
                            // Fonction pour formater la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return `${date.toLocaleDateString('fr-FR', options)}`;
      };
      const progression = getProgression(projet.id_projet);// Récupérer la progression du projet


                                return(
                                    <div key={index} className={style.projet_asso}>   
                                    <tr>
                                    <td   style={{
    backgroundImage: `url(${getCleanedImagePath(projet.image)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '80px',
    height: '80px',
  }}></td> <br/>
                                    <td style={{ cursor: 'pointer' }} onClick={()=>handleVideoClick(projet.id_projet,projet.Nom_projet,projet.Description)} ><p>{projet.Nom_projet}</p></td><br/>
                                    <td style={{ cursor: 'pointer' }}  onClick={()=>handleVideoClick(projet.id_projet,projet.Nom_projet,projet.Description)}> <a> <Image
                className={style.lien}
                src="/link.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> Voir.{projet.Nom_projet}</a> </td><br/>
                                    <td><p>{projet.Description}</p></td><br/>
                                    <p className={style.progression}>{progression}%</p>
                                    <tr>
                                    <div className={style.progressBarContainer}>
                                    
          <div
            className={style.progressBar}
            style={{ width: `${progression}%` }}
          ></div>
        </div>
                                </tr>
                             
                                    <td>
            <p> crée le <Image
                className={style.lien}
                src="/time.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> {formatDate(projet.createdAt)}</p>
          </td>
          <td> <p><Image
                className={style.lien}
                src="/time.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> Fin:  {formatDate(projet.date_fin_projet)} </p>
</td>
                                    
                                </tr>
                               
                                
      
                                        </div>
                                 
                                )
                               
                                })}
            </div>
      
<div className={style.pagination}>
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage} sur ${totalPages_projet}`}</span>
    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages_projet}>
        Suivant
    </button>
</div>

    </>
)}


{(user_role==='Chef de projet' || user_role==='Employée') &&(
    <><div className={style.div_bas}>
            {currentprojet2.map((projet, index) => {
                            // Fonction pour formater la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return ` ${date.toLocaleDateString('fr-FR', options)}`;
      };
      const progression = getProgression(projet.id_projet);// Récupérer la progression du projet
                                return(
                                    <div key={index} className={style.projet_asso}>   
                                    <tr>
                                    <td   style={{
    backgroundImage: `url(${getCleanedImagePath(projet.image)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '80px',
    height: '80px',
  }}></td> <br/>
                                    <td style={{ cursor: 'pointer' }} onClick={()=>handleVideoClick(projet.id_projet,projet.Nom_projet,projet.Description)} ><p>{projet.Nom_projet}</p></td><br/>
                                    <td style={{ cursor: 'pointer' }}  onClick={()=>handleVideoClick(projet.id_projet,projet.Nom_projet,projet.Description)}> <a> <Image
                className={style.lien}
                src="/link.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> Voir.{projet.Nom_projet}</a> </td><br/>
                                    <td><p>{projet.Description}</p></td><br/>
                                    <p className={style.progression}>{progression}%</p>
                                    <tr>
                                    <div className={style.progressBarContainer}>
                                        
          <div
            className={style.progressBar}
            style={{ width: `${progression}%` }}
          ></div>
        </div>
                                </tr>
                                    <td>
            <p> <Image
                className={style.lien}
                src="/time.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> créé le {formatDate(projet.createdAt)}</p>
          </td>
          <td> <p><Image
                className={style.lien}
                src="/time.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              /> Fin:  {formatDate(projet.date_fin_projet)} </p>
</td>
                                    
                                </tr>
                                        </div>
                                 
                                )
                               
                                })}
            </div>

<div className={style.pagination}>
    <button onClick={() => handlePageChange2(currentPage2 - 1)} disabled={currentPage2 === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage2} sur ${totalPages_projet2}`}</span>
    <button onClick={() => handlePageChange2(currentPage2 + 1)} disabled={currentPage2 === totalPages_projet2}>
        Suivant
    </button>
</div>

    </>
)}
            


        </div>
        </>
    )
}
