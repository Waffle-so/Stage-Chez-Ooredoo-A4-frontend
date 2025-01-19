import style from '../../styles/Report.module.css';
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Report({ username, userprenom, userIdd, user_role, usersecteur }) {
    const router = useRouter();
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredUsers2, setFilteredUsers2] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRoleOptions, setShowRoleOptions] = useState(null); // État pour afficher les options
    const [selectedRole, setSelectedRole] = useState(''); // Nouvel état pour le rôle

    const [nom_projet, setNomProjet] = useState(''); // État pour le nom du projet
    const [date_fin_projet,setdate_fin_projet]=useState('');
    const [Description_projet, setDescriptionProjet] = useState(''); // État pour le Description du projet
    const [file, setFile] = useState(null); 



    const [message, setMessage] = useState(''); // État pour afficher les messages de succès ou d'erreur
    const [projets,setprojets]=useState([]);

    const [filteredProjets, setFilteredProjets] = useState([]);  // Nouveau état pour les projets filtrés
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedProjectsname, setSelectedProjectsname] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);

    const [Objectifs,setObjectifs]=useState([]);
    const [buttonOK, setbutton_ok] = useState(false);

    const [selected_nom_projet, setselected_nom_projet] = useState([]);
    const [selected_descri_projet, setselected_descri_projet] = useState([]);
    const [selected_index_projet, setselected_index_projet] = useState([]);
    const [projet_asso,setprojet_asso]=useState([]);
    const [pagee, setpagee] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7; // Nombre d'utilisateurs par page
    const [currentPage2, setCurrentPage2] = useState(1);
    const projetperpage = 6;
    const [currentPage_proj_all, setCurrentPage_proj_all] = useState(1);
    const all_projetperpage = 6;

   
    
    const [modal_projet,set_modal_projet]=useState('');
    const [modal_addinprojet,set_modal_addinprojet]=useState('');
    const [modal_delete_projet,set_modal_deleteprojet]=useState('');

    const [selectedId, setselectedId]=useState('');
    const [selectednom, setselectednom]=useState('');
    const [selectedprenom, setselectedprenom]=useState('');
    const [selectedprojetId, setselectedprojetId]=useState('');
    const [selectedNomprojet, setselectedNomprojet]=useState('');

    const [selectedProjectId, setSelectedProjectId] = useState(null);

    
    /*DEBUT MODAL modal */ 
    const handleAdd_projet = () => { set_modal_projet(true); };
      const handleClose_projet = () => {  set_modal_projet(false);};
  /*FIN*/ 
  
  /*DEBUT MODAL modal */ 
  const handleAdd_inprojet = (userid,userNom,userPrenom) => { set_modal_addinprojet(true); setselectedId(userid); setselectednom(userNom);setselectedprenom(userPrenom) };
  const handleClose_inprojet = () => {  set_modal_addinprojet(false);setselectedId(null)};
/*FIN*/ 

 /*DEBUT MODAL modal */ 
 const handlemodal_deleteprojet = (projetId,nomprojet) => { set_modal_deleteprojet(true); setselectedprojetId(projetId),setselectedNomprojet(nomprojet) };
 const handleClose_deleteprojet = () => {  set_modal_deleteprojet(false);setselectedprojetId(null)};
/*FIN*/ 



const allowedTypes = ['image/jpeg', 'image/png', 'image/jfif','image/AVIF','image/webp'];
const [fileName, setFileName] = useState('No file chosen');
const [fileSize, setFileSize] = useState('');
const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileName(selectedFile.name + ' |');
        setFileSize((selectedFile.size / 1024).toFixed(2) + ' KB' + ' < 2 Go');
      } else {
        alert('Type de fichier non autorisé.');
        setFile(null);

      }
    } else {
      setFile(null);
    }
  };


const handleNavigateToProfile = (pageName, user) => {
    setpagee(pageName + ' >');
    localStorage.setItem('currentPage', pageName);
  
    // Naviguer vers la page de profil avec les paramètres dans l'URL
    router.push({
      pathname: '/Page_One_For_All', // Chemin vers la page de profil
      query: { 
        userId: user.id,
        userNom: user.nom,
        userPrenom: user.prenom,
        user_image: user.photoprofil,
        usertelephone: user.telephone,
        user_Gmail: user.Gmail,
        usersecteur: user.secteur,
        userdate: user.date
      }, // Passer les props dans l'URL
    }, undefined, { shallow: true });
  };




const handleCheckboxChange = (e, projectId,nom_project) => {
    if (e.target.checked) {
        setSelectedProjects(projectId); // Ajouter l'ID du projet
        setSelectedProjectsname(nom_project);
    } else {
        setSelectedProjects(null); // Supprimer l'ID du projet
    }
};

    useEffect(() => {
        if (userIdd) {
            fetchAllUsers();
            fetchAllProjets();
            fetch_all_objectifs(); 
        }
        if(user_role==='Chef de projet' || user_role==='Employée'){
            fetchAllUsers_for_others();
            fetchAllProjets_associeted();
            fetch_all_objectifs();
        }
    }, [userIdd]);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login2/Login2');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_employee`,
                { usersecteur },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const users = response.data.Users;
                console.log('tout ici :',users)
                setAllUsers(users);
                setFilteredUsers(users.filter((user)=>user.id !== userIdd && user.role !=='Administrateur')); // Initialiser `filteredUsers` avec les utilisateurs récupérés
                setFilteredUsers2(users);
                console.log('Détails de tous les utilisateurs récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails des utilisateurs');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
    };

    const fetchAllUsers_for_others = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login2/Login2');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_employee`,
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

    const fetchAllProjets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login2/Login2');
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
                
                setprojets(projets);
                setFilteredProjets(projets);  // Initialiser les projets filtrés avec tous les projets
                console.log('Détails de tous les projets récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails des projets');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
    };

    const handlechange_role = async (userid,role,nom,prenom) => {
        try {
    
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token not found');
            return;
          }

    
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/change_role`,{ userid,role,username:username,userprenom:userprenom,nom:nom,prenom:prenom},
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                
              },
            }
          );
          console.log('role changed successfully:', response.data);
          // Réinitialiser le champ de description après l'envoi
          router.reload();
        } catch (error) {
          console.error('Error changing role:', error);
        
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
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/get_all_obj_all`,{},
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


    // Fonction pour obtenir un chemin d'image nettoyé
    const getCleanedImagePath = (imagePath) => {
        if (!imagePath) return '';
        const imageName = imagePath.split(/[/\\]/).pop(); // Obtenez uniquement le nom du fichier
        const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, ''); // Nettoyez le chemin
        return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;
    };
    

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    
        // Filtrer parmi tous les utilisateurs
        const filtered = allUsers
            .filter((user) => user.id !== userIdd) // Exclure l'utilisateur courant
            .filter((user) =>
                `${user.nom} ${user.prenom}`.toLowerCase().includes(query)
            );
    
        // Si un projet est sélectionné, différencier les membres du projet
        if (projectMembers.length > 0) {
            const updatedFiltered = filtered.map((user) => ({
                ...user,
                isInProject: projectMembers.some(
                    (member) => member.id === user.id
                ),
            }));
            setFilteredUsers(updatedFiltered);
        } else {
            setFilteredUsers(filtered);
        }
    };




    const handleSearch2 = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    
        // Filtrer parmi tous les utilisateurs
        const filtered = allUsers
            .filter((user) => user.id !== userIdd) // Exclure l'utilisateur courant
            .filter((user) =>
                `${user.nom} ${user.prenom}`.toLowerCase().includes(query)
            );
    
        // Si un projet est sélectionné, différencier les membres du projet
        if (projectMembers.length > 0) {
            const updatedFiltered = filtered.map((user) => ({
                ...user,
                isInProject: projectMembers.some(
                    (member) => member.id === user.id
                ),
            }));
            setFilteredUsers2(updatedFiltered);
        } else {
            setFilteredUsers2(filtered);
        }
    };
    
    

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        filterUsers(searchQuery, role);
    };

    const filterUsers = (query, role) => {
        const baseUsers = projectMembers.length > 0 ? projectMembers : allUsers; // Limiter aux membres du projet si un projet est sélectionné
    
        const filtered = baseUsers
            .filter((user) => user.id !== userIdd && user.role !=='Administrateur') // Exclure l'utilisateur courant
            .filter((user) =>
                `${user.nom} ${user.prenom}`.toLowerCase().includes(query)
            )
            .filter((user) => (role ? user.role === role : true)); // Filtrer par rôle si un rôle est sélectionné
    
        setFilteredUsers(filtered);
    };
    

    const handleRoleChange2 = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        filterUsers2(searchQuery, role);
    };

    const filterUsers2 = (query, role) => {
        const baseUsers = projectMembers.length > 0 ? projectMembers : allUsers; // Limiter aux membres du projet si un projet est sélectionné
    
        const filtered = baseUsers
            .filter((user) =>
                `${user.nom} ${user.prenom}`.toLowerCase().includes(query)
            )
            .filter((user) => (role ? user.role === role : true)); // Filtrer par rôle si un rôle est sélectionné
    
        setFilteredUsers2(filtered);
    };
    
   

// Fonction pour ajouter un projet
const handleAddNewProject = async () => {
    if (!nom_projet || nom_projet.length > 60) {
        setMessage('Veuillez selectionner le nom du projet (doit pas dépasser 20 caractères)');
        return;
    }

    if (!Description_projet || Description_projet.length > 400) {
        setMessage('Veuillez selectionner la description  ( doit pas dépasser 400 caractères)');
        return;
    }
    if(!date_fin_projet){
        setMessage('La date de fin du projet du projet doit être saisi !');
    }

    if (!file) {
        setMessage('S il vous plait selectionner un fichier avant de valider.');
        return;
      }
    
      if (file.size > 10485760) {
        alert('File doit pas dépasser la limite de  10 MB.');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append('nom_projet', nom_projet);
      formData.append('Description_projet', Description_projet);
      formData.append('date_fin_projet', date_fin_projet);
      formData.append('username', username);
      formData.append('userprenom', userprenom);
      formData.append('usersecteur',usersecteur);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_projet`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log('projet added successfully:', response.data);
        router.reload();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du projet :', err);
        setMessage('Erreur lors de l\'ajout du projet');
    }
};


const fetchProjectMembers = async (id_projet) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token non trouvé");
        router.push('../Login2/Login2');
        return;
      }
  
      // Faire une requête pour récupérer les membres d'un projet
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_members`,
        { id_projet },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  console.log(response.data);
      if (response.data.success) {
        const Users = response.data.Users; // Les membres du projet
        if (Users && Users.length > 0){
            setFilteredUsers(Users); // Mettre à jour l'état avec les membres du projet
            setProjectMembers(Users);
            setFilteredUsers2(Users); 
        }else{
            setProjectMembers([]);
            setFilteredUsers([]); 
            setFilteredUsers2([]); 
        }
       
      } else {
        setProjectMembers([]);
        setFilteredUsers([]);
        setFilteredUsers2([]); 
        console.error('Erreur lors de la récupération des membres du projet');
      }
    } catch (err) {
      console.error('Erreur lors de la requête pour récupérer les membres du projet :', err);
    }
  };

  const fetchAllProjets_associeted = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
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
            console.log('interessant ',projets);
            setprojet_asso(projets);
            
            console.log('Détails de tous les projets associé ont été récupérés avec succès');
        } else {
            console.error('Erreur lors de la récupération des détails des projets associé ');
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
  };
  









  const handleProjectClick = (id_projet,nom,descri,index) => {
    // Appeler la fonction pour récupérer les membres du projet
    fetchProjectMembers(id_projet);
    setbutton_ok(true);
    setSelectedProjectId(id_projet); // Définit le projet sélectionné
    setselected_nom_projet(nom);
    setselected_descri_projet(descri);
    setselected_index_projet(index);

  };

  // Gestion du bouton "Supprimer" (affiché seulement pour les membres du projet)
const handleDeleteButtonVisibility = (userId) => {
    return projectMembers.some((member) => member.id === userId);
};

  const handle_Actualiser=()=>{
    fetchAllUsers();
    setSelectedProjectId(null);
    setFilteredUsers([]); // Réinitialise les utilisateurs filtrés si nécessaire
    setFilteredUsers2([]); // Réinitialise les utilisateurs filtrés si nécessaire
    setbutton_ok(false); // Cache les boutons "Ajouter" ou "Supprimer"
    setProjectMembers([]); // Réinitialise les membres du projet, annulant ainsi la visibilité des boutons "Supprimer"
    setSelectedRole('');
  }


  // Fonction pour ajouter un projet
const handleAddNewmember_inprojet = async (selectednom,selectedprenom) => {
   
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_member_inprojet`,
            {    userid : selectedId ,
                 projetId : selectedProjects,
                 projet_name:selectedProjectsname,
                 username:username, 
                 userprenom:userprenom, 
                 nom: selectednom,
                 prenom: selectedprenom,
                },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log('memeber added successfully:', response.data);
        router.reload();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du memeber :', err);
        setMessage('Erreur lors de l\'ajout du memeber');
    }
};


const remove_member_from_projet = async (userid,nom,prenom) => {
   
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/remove_member`,
            { userid : userid , projetId : selectedProjectId, projetname:selected_nom_projet, username:username, userprenom:userprenom, nom_user:nom, prenom_user:prenom},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log('memeber remove successfully:', response.data);
        router.reload();
    } catch (err) {
        console.error('Erreur lors de la suppression du memeber :', err);
        setMessage('Erreur lors de la suppression du memeber');
    }
};

const handle_delete_projet=async(projet_id)=>{
    try{
      const token = localStorage.getItem('token');
          if (!token) {
              console.error('Token not found');
              return;
          }
          

          const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_projet`,
          {
            // Passez encadreurId et apprentiId dans les données à envoyer
            id_projet:projet_id,
            username:username,
            userprenom:userprenom,    
          },{
            headers: {
              'Authorization': `Bearer ${token}`,
          }, });
          console.log('projet supprimé avec succès', response.data);
          router.reload();
          
  }catch(err){
    console.error('Erreur lors de la suppression du projet  :', err);
  }}



const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;

const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

const currentUsers2 = filteredUsers2.slice(indexOfFirstUser, indexOfLastUser);

const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
const totalPages2 = Math.ceil(filteredUsers2.length / usersPerPage);

const handlePageChange = (page) => {
    setCurrentPage(page);
};





const indexOfLastprojet = currentPage2 * projetperpage;
const indexOfFirstprojet = indexOfLastprojet - projetperpage;

const currentprojet = projet_asso.slice(indexOfFirstprojet, indexOfLastprojet);
const totalPages_projet = Math.ceil(projet_asso.length / projetperpage);

const handlePageChange2 = (page) => {
    setCurrentPage2(page);
};



const indexOfLastprojet_all = currentPage_proj_all * all_projetperpage;
const indexOfFirstprojet_all = indexOfLastprojet_all - all_projetperpage;

const currentprojet_all = filteredProjets.slice(indexOfFirstprojet_all, indexOfLastprojet_all);
const totalPages_projet_all = Math.ceil(filteredProjets.length / all_projetperpage);


const handlePageChange_proj_all = (page) => {
    setCurrentPage_proj_all(page);
};


  

    return (
        <div className={style.Report_div_all}>
           
            {user_role === 'Chef de section' && (
                <>
                    <h1>Liste des Utilisateurs</h1><br/>
            <div className={style.flexing}>
            <input
                        type="text"
                        placeholder="Rechercher un utilisateur ..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className={style.searchInput}
                    />
                    <button className={style.but_actualiser} onClick={()=>handle_Actualiser()}> Actualiser </button>
                    
                     <select
                    className={style.roleFilter}
                    value={selectedRole}
                    onChange={handleRoleChange}
                >
                    <option value="">Filtre</option>
                    <option value="">Tous les rôles</option>
                    <option value="Employée">Employée</option>
                    <option value="Chef de projet">Chef de projet</option>
                </select>
                    <button className={style.ajou_Button} onClick={handleAdd_projet}> Ajouter Projet +</button><br/>
                    <p className={style.info}> Filtrer : (Chef de projet) pour voir le nombre de publications auquel ils ont posté ! </p>

                    {modal_projet &&(
                        <>
                        
                        <div className={style.modal_container_profile}>
                        <div className={style.modal_container_rec_offre}>
                            <h2> Ajouter un projet </h2><br/>
                            <div>
                            <label>Nom du projet * </label><br/>
                            <input type='text' maxLength={60} placeholder='Ajouter un nom au projet' onChange={(e)=> setNomProjet(e.target.value)}/><br/><br/>
                            </div>

                            <div>
                           <label>date de fin du projet *</label><br/>
                           <input type='date' value={date_fin_projet}  onChange={(e)=>{ setdate_fin_projet(e.target.value)}}/><br/><br/>
                           </div>
                          
                          <div>
                          <label>Description du projet * </label><br/>
                            <textarea type='text' maxLength={400} placeholder='Ajouter une description au projet' onChange={(e)=> setDescriptionProjet(e.target.value)}/><br/><br/>

                          </div>

                          <div>
                          <label>Image * </label><br/>
                   
                            <div className={style.fileUpload}>
                                    <input type="file" name="file" id="fileInput" className={style.modal_file_choice}   onChange={handleFileChange}/>
                                    <label htmlFor="fileInput" className={style.customFileLabel}>
                                    <span className={style.uploadButton}>
                                  </span>
             <h5> Metter votre Publication ICI ↓ </h5><br/>
                                    <span className={style.fileName}>{fileName} {fileSize}</span>
    
                                      </label>        <br/><br/><br/><br/><br/> <p className={style.err_message}>{message} </p>
                                    </div>
                          </div>
                         
                           
                            <button  style={{ cursor: 'pointer' }} onClick={handleClose_projet}> Fermer</button>
                            <button   style={{ cursor: 'pointer' }} onClick={()=>handleAddNewProject()}> Terminer</button>
                            </div>
                        </div>
                        </>
                    )}
            </div>


                <div className={style.div_all_tableau}>
                {filteredUsers && filteredUsers.length > 0 ? (
                <div className={style.table_container}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>jj/mm/aaaa</th>
                                <th>Connexion</th>
                                <th>Fichiers</th>
                                {selectedRole === "Chef de projet" &&(
                                 <th> Publications </th>
                                  )}
                                <th> </th>
                                <th> </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user, index) => {
                                const cleanedImagePath = getCleanedImagePath(user.photoprofil); // Chemin nettoyé
                                const utilisateur = user.Utilisateur ; // Accès au premier utilisateur
                                const userId =user.id || (utilisateur ? utilisateur.id : 'id non disponible');
                                const userNom = user.nom || (utilisateur ? utilisateur.nom : 'Nom non disponible'); // Nom de l'utilisateur
                                const userPrenom = user.prenom || (utilisateur ? utilisateur.prenom : 'prenom non disponible'); // Nom de l'utilisateur
                                const userrole = user.role || (utilisateur ? utilisateur.role : 'role non disponible'); // Nom de l'utilisateur
                                const userdate = user.date || (utilisateur ? utilisateur.date : 'date non disponible'); // Nom de l'utilisateur
                                const userConnexion = user.Nbr_Connexion || (utilisateur ? utilisateur.Nbr_Connexion: 'Nombre non disponible');
                                const isInProject =  buttonOK && user.isInProject ? "✔️" : ""; // Indicateur
                                return (
                                    <tr key={index} className={style.tr_table}>
                                         <td>#{userId}</td>
                                        
                                        <td>{cleanedImagePath ? (
                                                <img
                                                    src={cleanedImagePath}
                                                    alt={`${user.nom} ${user.prenom}`}
                                                    className={style.user_image}
                                                />
                                            ) : (
                                                'Pas d\'image'
                                            )} <p style={{ cursor: 'pointer' }} onClick={() => handleNavigateToProfile('Profile_visit', user)}>{`${userNom} ${userPrenom} `} {'( '}{userrole}{' )'}</p></td>
                                        
                                        <td>{userdate ? userdate.slice(0,10) : 'date non disponible'}</td>
                                        <td>{userConnexion} <Image
             src='/green_arrow.png'
             alt="Profil"
             width={40}
             height={40}
             className={style.arrow}
           /></td>
           <td className={style.nbr_de}>{user.Nbr_add_file}<Image
              src={user.add_file_on === 1 ? '/green_arrow.png' : '/red_arrow.png'}
             alt="Profil"
             width={40}
             height={40}
             className={style.arrow}
           /></td>
           {selectedRole === "Chef de projet" && (
  <td className={style.nbr_de}>{user.Nbr_add_video || 0}</td>
)}
                                        <td>
                <div
                    className={style.roleContainer}
                    onMouseEnter={() => setShowRoleOptions(index)}
                    onMouseLeave={() => setShowRoleOptions(null)}
                >
                    <button className={style.mainButton}>Changer rôle</button>
                    {showRoleOptions === index && (
                        <div className={style.roleOptions}>
                            <button onClick={() => handlechange_role(user.id, 'Employée',user.nom,user.prenom)}  className={style.optionButton} >
                                Employée
                            </button>
                            <button onClick={() => handlechange_role(user.id, 'Chef de projet',user.nom,user.prenom)}  className={style.optionButton} >
                                Chef de projet
                            </button>
                        </div>
                    )}
                </div>
            </td>
            {!handleDeleteButtonVisibility(user.id) && (  <td><button className={style.mainButton2} onClick={()=>handleAdd_inprojet(userId,user.nom,user.prenom)} disabled={user.isInProject} > Ajouter dans un projet </button></td>)}
          
            {handleDeleteButtonVisibility(user.id) && (
                                        <td>
                                            <button
                                                className={style.deleteButton}
                                                onClick={() => remove_member_from_projet(userId,user.nom,user.prenom)}
                                            >
                                                   <Image 
  className={style.trash_pic}
  src='/trash2.png' 
  width={350}       
  height={390}
  alt="Picture of the author"
  priority 
/>
                                            </button>
                                        </td>
                                    )}
            <td>{isInProject}</td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                
<div className={style.pagination}>
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage} sur ${totalPages}`}</span>
    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Suivant
    </button>
</div>

                </div>
                
            ) : (
                <>
                <table className={style.table_error}>
                <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>Role</th>
                                <th>date de naissance</th>
                                <th> </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> #0 </td>
                                <td>Aucun utilisateur trouvé </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>

                        </tbody>

                </table>
                </>
               
            )}


{modal_addinprojet && (
    <>
        <div className={style.modal_container_profile}>
            <div className={style.modal_container_rec_offre2}>
                <h2> Ajouter l'utilisateur dans quel projet ? </h2><br/>
                <br />
                {/* Tableau des projets */}
                <div className={style.table_container2}>
                    {filteredProjets.length > 0 ? (
                        <table className={style.table_projet}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nom du Projet</th>
                                    <th>Ajouter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjets.map((projet, index) => (
                                    <tr key={index}>
                                        <td>#{projet.id_projet}</td>
                                        <td><p>{projet.Nom_projet} </p></td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={projet.id_projet}
                                                checked={selectedProjects === projet.id_projet}
                                                onChange={(e) => handleCheckboxChange(e, projet.id_projet,projet.Nom_projet)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucun projet trouvé.</p>
                    )}
 
                </div>
                {/* Boutons d'action */}<br/>
                <button style={{ cursor: 'pointer' }} onClick={handleClose_inprojet}> Fermer</button>
                <button style={{ cursor: 'pointer' }} onClick={()=>handleAddNewmember_inprojet(selectednom,selectedprenom)}> Terminer</button>
               
            </div>
        </div>
    </>
)}



{modal_delete_projet &&(
                        <>
                        
                        <div className={style.modal_container_profile}>
                        <div className={style.modal_container_rec_offre}>
                            <h2> Etes vous sûr de supprimer le projet {selectedNomprojet} ?</h2><br/>
                            

                            <button  style={{ cursor: 'pointer' }} onClick={handleClose_deleteprojet}> Fermer</button>
                            <button   style={{ cursor: 'pointer' }} onClick={()=>handle_delete_projet(selectedprojetId)}> Oui</button>
                            </div>
                        </div>
                        </>
                    )}

<div className={style.table_container}>
                {filteredProjets.length > 0 ? (
                    <table className={style.table_projet}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Projets </th>
                                <th>  </th>
                               
                                
                            </tr>
                        </thead>
                        <tbody>
                        {currentprojet_all.map((projet, index) => {

    return (
        <tr key={index}>
            <td>#{projet.id_projet}</td>
            <div className={style.projectNameContainer}>
            <td><p>{projet.Nom_projet}</p></td>

            <div className={style.deleteButtonContainer}>
              <button onClick={() => handlemodal_deleteprojet(projet.id_projet, projet.Nom_projet)}>
                <Image
                  className={style.trash}
                  src="/trash.png"
                  width={350}
                  height={350}
                  alt="Trash icon"
                  priority
                />
              </button>
            </div>
            </div>
            <td className={style.trash_but}>
                <button onClick={() => handleProjectClick(projet.id_projet,projet.Nom_projet)}>Voir</button>
            </td>
        </tr>
    );
})}

                        </tbody>
                    </table>
                ) : (
                    <p>Aucun projet trouvé.</p>
                )}
                 <div className={style.pagination}>
    {Array.from({ length: totalPages_projet_all }, (_, index) => (
        <button
            key={index + 1}
            onClick={() => handlePageChange_proj_all(index + 1)}
            className={currentPage_proj_all === index + 1 ? style.activeButton : ""}
        >
            {index + 1}
        </button>
    ))}
</div>
            </div> 

                </div>
                </>



            )}













{(user_role && user_role === 'Chef de projet') && (
    <>
    <div>
    <h1>Employées de votre Secteur </h1><br/>
    <div className={style.flexing2}>
    <input
                        type="text"
                        placeholder="Rechercher un utilisateur ..."
                        value={searchQuery}
                        onChange={handleSearch2}
                        className={style.searchInput}
                    />
                    <button className={style.but_actualiser} onClick={()=>handle_Actualiser()}> Actualiser </button>
                     <select
                    className={style.roleFilter}
                    value={selectedRole}
                    onChange={handleRoleChange2}
                >
                    <option value="">Filtre</option>
                    <option value="">Tous les rôles</option>
                    <option value="Employée">Employée</option>
                    <option value="Chef de projet">Chef de projet</option>
                </select>
                

            </div>


    <div className={style.div_all_tableau}>
      
             {filteredUsers2 && filteredUsers2.length > 0 ? (
        <div className={style.table_container}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th> Role</th>
                                <th>jj/mm/aaaa</th>
                                <th>Connexion</th>
                                <th>Fichiers</th>
                                {selectedRole === "Chef de projet" &&(
                                 <th> Publications </th>
                                  )}
                             
                            </tr>
                        </thead>
                        <tbody>
                        {currentUsers2.map((user, index) => {
                                const cleanedImagePath = getCleanedImagePath(user.photoprofil); // Chemin nettoyé
                                const utilisateur = user.Utilisateur ; // Accès au premier utilisateur
                                const userId =user.id || (utilisateur ? utilisateur.id : 'id non disponible');
                                const userNom = user.nom || (utilisateur ? utilisateur.nom : 'Nom non disponible'); // Nom de l'utilisateur
                                const userPrenom = user.prenom || (utilisateur ? utilisateur.prenom : 'prenom non disponible'); // Nom de l'utilisateur
                                const userrole = user.role || (utilisateur ? utilisateur.role : 'role non disponible'); // Nom de l'utilisateur
                                const userdate = user.date || (utilisateur ? utilisateur.date : 'date non disponible'); // Nom de l'utilisateur
                                const userConnexion = user.Nbr_Connexion || (utilisateur ? utilisateur.Nbr_Connexion: 'Nombre non disponible');
                                return (
                                    <tr key={index} className={style.tr_table2}>
                                         <td>#{userId}</td>
                                        
                                        <td>{cleanedImagePath ? (
                                                <img
                                                    src={cleanedImagePath}
                                                    alt={`${user.nom} ${user.prenom}`}
                                                    className={style.user_image}
                                                />
                                            ) : (
                                                'Pas d\'image'
                                            )} <p style={{ cursor: 'pointer' }} onClick={() => handleNavigateToProfile('Profile_visit', user)} >{`${userNom} ${userPrenom}`}</p></td>
                                        <td>{userrole}</td>
                                        <td>{userdate ? userdate.slice(0,10) : 'date non disponible'}</td>
                                        <td>{userConnexion} <Image
             src='/green_arrow.png'
             alt="Profil"
             width={40}
             height={40}
             className={style.arrow}
           /></td>
           <td className={style.nbr_de}>{user.Nbr_add_file}<Image
              src={user.add_file_on === 1 ? '/green_arrow.png' : '/red_arrow.png'}
             alt="Profil"
             width={40}
             height={40}
             className={style.arrow}
           /></td> 
           {selectedRole === "Chef de projet" && (
            <td className={style.nbr_de}>{user.Nbr_add_video || 0}</td>
          )}

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className={style.pagination}>
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage} sur ${totalPages2}`}</span>
    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages2}>
        Suivant
    </button>
</div>



                </div>
             ):(  <>
                <table className={style.table_error}>
                <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>Role</th>
                                <th>date de naissance</th>
                                <th> </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> #0 </td>
                                <td>Aucun utilisateur trouvé </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>

                        </tbody>

                </table>
                </>)}
        




<div className={style.display}>

        <div className={style.table_container}>
                {filteredProjets.length > 0 ? (
                    <table className={style.table_projet}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom du Projet</th>
                                <th>  </th>
                                
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentprojet.map((projet, index) => {
                            
                                return(
                                    <tr key={index}>
                                    <td>#{projet.id_projet}</td>
                                    <td className={style.projet_nom_prob}><p>{projet.Nom_projet}</p></td>
                                   
                                    <td>     <button onClick={() => handleProjectClick(projet.id_projet,projet.Nom_projet,projet.Description,index)} > Voir</button> </td>
                                    
                                </tr>
                                )
                               
                                })}
                        </tbody>
                    </table>
                ) : (
                    <p>Aucun projet trouvé.</p>
                )}

                 <div className={style.pagination}>
    {Array.from({ length: totalPages_projet }, (_, index) => (
        <button
            key={index + 1}
            onClick={() => handlePageChange2(index + 1)}
            className={currentPage2 === index + 1 ? style.activeButton : ""}
        >
            {index + 1}
        </button>
    ))}
</div>
            </div>
            
            <div>
           
            </div>
           

</div>
        

    </div>

 
    </div>

    </>
)}





















{( user_role && user_role === 'Employée') && (
    <>
    <div>
    <h1>Employées de votre Secteur </h1><br/>
    <div className={style.flexing2}>
    <input
                        type="text"
                        placeholder="Rechercher un utilisateur ..."
                        value={searchQuery}
                        onChange={handleSearch2}
                        className={style.searchInput}
                    />
                    <button className={style.but_actualiser} onClick={()=>handle_Actualiser()}> Actualiser </button>
                     <select
                    className={style.roleFilter}
                    value={selectedRole}
                    onChange={handleRoleChange2}
                >
                    <option value="">Filtre</option>
                    <option value="">Tous les rôles</option>
                    <option value="Employée">Employée</option>
                    <option value="Chef de projet">Chef de projet</option>
                </select>
                 

                    {modal_projet &&(
                        <>
                        
                        <div className={style.modal_container_profile}>
                        <div className={style.modal_container_rec_offre}>
                            <h2> Ajouter un nom au projet </h2><br/>
                            <input type='text' maxLength={60} placeholder='Ajouter un nom au projet' onChange={(e)=> setNomProjet(e.target.value)}/><br/><br/>
                            <textarea type='text' maxLength={150} placeholder='Ajouter une description au projet' onChange={(e)=> setDescriptionProjet(e.target.value)}/><br/><br/>

                            <button  style={{ cursor: 'pointer' }} onClick={handleClose_projet}> Fermer</button>
                            <button   style={{ cursor: 'pointer' }} onClick={handleAddNewProject}> Terminer</button>
                            </div>
                        </div>
                        </>
                    )}
            </div>


    <div className={style.div_all_tableau}>
      
             {filteredUsers2 && filteredUsers2.length > 0 ? (
        <div className={style.table_container}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>#</th>  
                                <th>Nom Complet</th>
                                <th>Role</th>
                                <th>date de naissance</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentUsers2.map((user, index) => {
                                const cleanedImagePath = getCleanedImagePath(user.photoprofil); // Chemin nettoyé
                                const utilisateur = user.Utilisateur ; // Accès au premier utilisateur
                                const userId =user.id || (utilisateur ? utilisateur.id : 'id non disponible');
                                const userNom = user.nom || (utilisateur ? utilisateur.nom : 'Nom non disponible'); // Nom de l'utilisateur
                                const userPrenom = user.prenom || (utilisateur ? utilisateur.prenom : 'prenom non disponible'); // Nom de l'utilisateur
                                const userrole = user.role || (utilisateur ? utilisateur.role : 'role non disponible'); // Nom de l'utilisateur
                                const userdate = user.date || (utilisateur ? utilisateur.date : 'date non disponible'); // Nom de l'utilisateur
                                const isInProject =  buttonOK && user.isInProject ? "✔️" : ""; // Indicateur
                                return (
                                    <tr key={index}>
                                         <td>#{userId}</td>
                                        
                                        <td>{cleanedImagePath ? (
                                                <img
                                                    src={cleanedImagePath}
                                                    alt={`${user.nom} ${user.prenom}`}
                                                    className={style.user_image}
                                                />
                                            ) : (
                                                'Pas d\'image'
                                            )} <p style={{ cursor: 'pointer' }} onClick={() => handleNavigateToProfile('Profile_visit', user)} >{`${userNom} ${userPrenom}`}</p></td>
                                        <td>{userrole}</td>
                                        <td>{userdate ? userdate.slice(0,10) : 'date non disponible'}</td>
             <td>{isInProject}</td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className={style.pagination}>
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage} sur ${totalPages2}`}</span>
    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages2}>
        Suivant
    </button>
</div>

                </div>
             ):(  <>
                <table className={style.table_error}>
                <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>Role</th>
                                <th>date de naissance</th>
                                <th> </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> #0 </td>
                                <td>Aucun utilisateur trouvé </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>

                        </tbody>

                </table>
                </>)}
        




<div className={style.display}>

        <div className={style.table_container}>
                {filteredProjets.length > 0 ? (
                    <table className={style.table_projet}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom du Projet</th>
                                <th>  </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentprojet.map((projet, index) => {
                               
                                return(
                                    <tr key={index}>
                                    <td>#{projet.id_projet}</td>
                                    <td className={style.projet_nom_prob}><p>{projet.Nom_projet}</p></td>
                                    <td>     <button onClick={() => handleProjectClick(projet.id_projet,projet.Nom_projet,projet.Description,index)} > Voir</button> </td>
                                    
                                </tr>
                                )
                               
                                })}
                        </tbody>
                    </table>
                ) : (
                    <p>Aucun projet trouvé.</p>
                )}

                 <div className={style.pagination}>
    {Array.from({ length: totalPages_projet }, (_, index) => (
        <button
            key={index + 1}
            onClick={() => handlePageChange2(index + 1)}
            className={currentPage2 === index + 1 ? style.activeButton : ""}
        >
            {index + 1}
        </button>
    ))}
</div>
            </div>
            
            <div>
           
            </div>
           

</div>
        

    </div>

 
    </div>

    </>
)}









        </div>
    );
}
