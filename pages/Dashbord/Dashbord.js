import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import style from '../../styles/Dashbord.module.css';
import { PieChart } from './PieChart.js';
import PieChart2 from './PieChart2';
import Router from 'next/router.js';
import io from 'socket.io-client';

export default function Dashbord({ userIdd,username,userprenom }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedrole, setSelectedrole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(13);
  const [pagee, setpagee] = useState('');
  const [startDate, setStartDate] = useState(''); // Date de début
  const [endDate, setEndDate] = useState(''); // Date de fin
  const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche

  const [modal_Ajout_User, set_modal_Ajout_User]=useState(false);
  const [user_info, set_user_info]=useState([]);

  const [modal_send_notif, set_modal_send_notif]=useState(false);

  const [nom,setname]=useState('');
  const [prenom,setprenom]=useState('');
  const [date_de_naissance,setdate]=useState('');
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');
  const [secteur, setsecteur]=useState('');
  const [role,setrole]=useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');


  const [notificationMessage, setNotificationMessage] = useState(""); // Message de la notification
  const [notifications, setNotifications] = useState([]);
  const [socket, setsocket] = useState(null);
  const [message, setMessage] = useState("");

  
  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };
  
  const handleNavigateToProfile = (pageName, user) => {
    setpagee(pageName + ' >');
    localStorage.setItem('currentPage', pageName);
  
    // Naviguer vers la page de profil avec les paramètres dans l'URL
    Router.push({
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
  

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      Router.push('/Login2/Login2');
      return;
    }

    const newsocket = io(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      withCredentials: true,
      transports: ['websocket'],
      auth: { token: token },
    });

    setsocket(newsocket);


    return () => {
      newsocket.disconnect();
    };
  }, [Router]);

  useEffect(() => {
    if (socket) {

      const handleReceiveNotification=(data)=>{
        console.log('Notification reçue : ', data); // Vérifier les données de la notification
        setNotifications(prevNotifications => [...prevNotifications, data]); 
       }

       socket.on('receive_notif', handleReceiveNotification);

        // Nettoyage de l'écouteur lors du démontage du composant
      return () => {
        socket.off('receive_notif', handleReceiveNotification);
      };


}} ,[socket]);


const sendnotif = () => {
  if (message.trim() !== ""  && socket) {
    const newMessage = {
      message: message,
      timestamp: new Date().toISOString(), // Format ISO 8601
    };
    // Envoyer le message via le socket
    socket.emit('/api/send_notif', newMessage);
    // Vider la zone de texte après l'envoi
    setMessage("");
  }
};




 /*DEBUT MODAL user */ 
 const handleAdd_user = () => {
  set_modal_Ajout_User(true);
};
const handleClose_user = () => {
  set_modal_Ajout_User(false);
};

 /*DEBUT MODAL notif */ 
 const handleAdd_notif = () => {
  set_modal_send_notif(true);
};
const handleClose_notif = () => {
  set_modal_send_notif(false);
};



  useEffect(() => {
    if (userIdd) {
      fetchAllUsers();
    }
  }, [userIdd]);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé');
        Router.push('../Login2/Login2');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_users`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAllUsers(response.data.Users);
        console.log('Détails de tous les utilisateurs récupérés avec succès');
      } else {
        console.error('Erreur lors de la récupération des détails des utilisateurs');
      }
    } catch (err) {
      console.error('Erreur lors de la requête :', err);
    }
  };

 

  const getProfileImagePath = (profilePath) => {
    if (!profilePath) return '/default-profile.jpg'; // Chemin d'image par défaut
    const profileImageName = profilePath.split(/[/\\]/).pop();
    const cleanedProfileImageName = profileImageName.replace(/^(public\/)?(files\/)?/, '');
    return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedProfileImageName}`;
  };

  // Convertir la date de naissance au format 'YYYY-MM-DD' pour faciliter le filtrage
  const formatDateOfBirth = (date) => {
    return new Date(date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
  };

  const filteredUsers = allUsers.filter((user) => {
    const matchesService = selectedService ? user.secteur === selectedService : true;
    const matchesRole = selectedrole ? user.role === selectedrole : true;
    return matchesService && matchesRole;
  });
  



     // Filtrage des utilisateurs par plage de dates de naissance
  const filteredByDateRange = filteredUsers.filter((user) => {
    const userDate = formatDateOfBirth(user.date);
    const isAfterStartDate = startDate ? userDate >= startDate : true;
    const isBeforeEndDate = endDate ? userDate <= endDate : true;
    return isAfterStartDate && isBeforeEndDate;
  });

    
  // Filtrer les utilisateurs par nom (recherche)
  const searchedUsers = filteredByDateRange.filter((user) => {
    const fullName = (user.nom + ' ' + user.prenom).toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });





  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(searchedUsers.length / usersPerPage);




  
  const submit =async() => {
try{

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    return;
  }

 // Vérifier si les champs requis sont vides
 if (!nom || !prenom || !date_de_naissance || !email || !password || !role) {
  setError("Veuillez remplir tous les champs.");
  alert("Veuillez remplir tous les champs.")
  return;
}

  if(password.length<10){
    setPasswordError("10 caractéres minimum.");
    return
  }
  axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/submit`,
   
  {
    nom : nom,
    prenom : prenom,
    date_de_naissance: date_de_naissance, 
    email : email,
    password: password,
    secteur:secteur,
    role:role,
    username:username,
    userprenom:userprenom,

  },
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      
    },
  }
).then(()=> {
        set_user_info([...user_info, {nom: nom, prenom: prenom, date_de_naissance: date_de_naissance, email: email, password: password,role:role}]) // pour apparaitre directement dans l'écran
    console.log("données insérées avec succées !");
    Router.reload();
  
  })
  .catch((error) => {
    console.log(error);
    setError('Le mail ou le mot de passe existe déja ! ');
  });
}catch(err){
  console.error('Error lors de l ajout d un utilisateur :', error);
}


    
  };


  return (
    <div className={style.Dashbord_all_div}>
   
      <div>
      <h1>Dashbord</h1>
      <br />
      <p className={style.remarque}> Remarque : Les nombres de connexions ainsi que les fichiers ajouter son remis à 0 chaque semaine (ceci n'est pas le cas pour les videos pour les chef de projet ) !</p>
      <div className={style.flexing}>


{/* Barre de recherche */}
<div>
<input
 type="text"
 placeholder="Rechercher par nom..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className={style.searchInput}
/>
</div>



<div>
{/* Menu déroulant pour filtrer par rôle */}
<select
 id="role-filter"
 value={selectedService}
 onChange={(e) => setSelectedService(e.target.value)}
 className={style.select}
>
 <option value="">Tous</option>
 <option value="Informatique">Informatique</option>
 <option value="Journalisme">Journalisme</option>
 <option value="Marketing">Marketing</option>
 <option value="Réseau">Réseau</option>Journalisme
 <option value="Ressource humaine">Ressource humaine</option>
 <option value="Journalisme">Journalisme</option>
</select>

<select
 id="role-filter"
 value={selectedrole}
 onChange={(e) => setSelectedrole(e.target.value)}
 className={style.select2}
>
 <option value="">Rôle</option>
 <option value="Administrateur">Administrateur</option>
 <option value="Chef de section">Chef de section</option>
 <option value="Chef de projet">Chef de projet</option>
 <option value="Employée">Employée</option>
 <option value="Stagiaire">Stagiaire</option>
 <option value="Visiteur">Visiteur</option>
</select>
</div>

<button style={{ cursor: 'pointer' }} className={style.but_add_newprofile} onClick={handleAdd_user}>
 Ajouter un nouveau membre +
</button >
<button style={{ cursor: 'pointer' }} className={style.but_add_newprofile} onClick={handleAdd_notif}>
 Notification +
</button >


{modal_Ajout_User &&(
<>
<div className={style.modal_container_profile}>
<div className={style.modal_container_rec_offre}>
 <h1> Ajouter un nouveau utilisateur </h1>

<div className={style.flexing}>
<div>
<label className={style.label}>Nom <p>*</p></label>
<input  value={nom} type="text" placeholder="Nom" onChange={(e)=>{ setname(e.target.value)}} />
</div>

<div>
<label className={style.label}>Prénom <p>*</p></label>
<input  value={prenom} type="text" placeholder="Prénom" onChange={(e)=>{ setprenom(e.target.value)}} />
</div>
</div>



<div className={style.flexing}>
<div>
<label className={style.label}>Date de naissance <p>*</p></label>
<input value={date_de_naissance}  type="date" placeholder="Date de naissance" onChange={(e)=>{ setdate(e.target.value)}} />
</div>

<div className={style.select_div_service}>
<label className={style.label}>Serice <p>*</p></label>
<select value={secteur} onChange={(e)=>{ setsecteur(e.target.value)}}>
<option value=""> -- Service -- </option>
<option value="Informatique"> Informatique </option>
<option value="Marketing"> Marketing </option>
<option value="Journalisme"> Journalisme </option>
<option value="Réseau"> Réseau </option>
<option value="Ressource humaine"> Ressource humaine </option>
</select>
</div>
</div>



<div>
<div className={style.role_div}>

<select value={role} onChange={(e)=>{ setrole(e.target.value)}}>
<option value=""> Choisir le Role de l'utilisateur <p>*</p> </option>
<option value="Administrateur"> Administrateur </option>
<option value="Chef de section"> Chef de section </option>
<option value="Chef de projet"> Chef de projet </option>
<option value="Employée"> Employée </option>
<option value="Stagiaire"> Stagiaire </option>
<option value="Visiteur"> Visiteur </option>
</select>
</div>
</div>


<div className={style.flexing}>

<div className={style.input_group}>
<label className={style.label}>Email <p>*</p></label>
<input value={email} type="email" placeholder="Email" onChange={(e)=>{ setemail(e.target.value)}} />
</div>

<div className={style.input_group}>
<label className={style.label}>Password <p>*</p></label>
<input value={password} type="password" placeholder="Password" onChange={(e)=>{ setpassword(e.target.value)}} />
</div>

</div>


 <button onClick={submit} style={{ cursor: 'pointer' }} > Terminer </button>
 <button onClick={handleClose_user} style={{ cursor: 'pointer' }} > Fermer </button>

 </div>
 </div>
</>
)}



{/* Filtre par plage de dates */}
<div className={style.div_dateInput}>
<label>
 De :
 <input
   type="date"
   value={startDate}
   onChange={(e) => setStartDate(e.target.value)}
   className={style.dateInput}
 />
</label>
<label>
 À :
 <input
   type="date"
   value={endDate}
   onChange={(e) => setEndDate(e.target.value)}
   className={style.dateInput}
 />
</label>
</div>


</div>


<div className={style.tableContainer}>
<table className={style.table}>
<thead>
 <tr>
   <th>#</th>
   <th>Profil</th>
   <th>Rôle</th>
   <th>Secteur</th>
   <th>Connexion</th>
   <th>Fichiers</th>
   {selectedrole === "Chef de projet" &&(
    <th> Publications</th>
   )}
   <th>Date de naissance</th>
 </tr>
</thead>
<tbody>
 {currentUsers.map((user) => {
   const profileImagePath = getProfileImagePath(user.photoprofil);
   const userName = user.nom + ' ' + user.prenom;
   //console.log('user en question :',user)
   return (
    <tr key={user.id} >

       <td>#{user.id}</td>
       <td>
         <div style={{ display: 'flex', alignItems: 'center' }}>
           <Image
             src={profileImagePath}
             alt="Profil"
             width={40}
             height={40}
             style={{ borderRadius: '50%' }}
           />
           <p onClick={() => handleNavigateToProfile('Profile_visit', user)} style={{ cursor: 'pointer' }}>{userName}</p>
         </div>
       </td>
       <td>
  <p
    className={`${style.user_role} ${
      user.role === "Administrateur"
        ? style.admin
        : user.role === "Chef de section"
        ? style.Chef_section
        : user.role === "Chef de projet"
        ? style.Chef_projet
        : user.role === "Employée"
        ? style.employee
        : user.role === "Stagiaire"
        ? style.Stagiaire
        : user.role === "Visiteur"
        ? style.Visiteur
        : ""
    }`}
  >
    {user.role}
  </p>
</td>
       <td><p className={style.user_secteur}> {user.secteur}</p></td>
       <td className={style.nbr_de}> {user.Nbr_Connexion}  <Image
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
           {selectedrole === "Chef de projet" && (
  <td className={style.nbr_de}>{user.Nbr_add_video || 0}</td>
)}
       <td>{user.date ? user.date.slice(0, 10) : ''}</td>
     </tr>
   );
 })}
</tbody>
</table>

{/* Pagination */}
<div className={style.pagination}>
<button
 onClick={() => paginate(currentPage - 1)}
 disabled={currentPage === 1}
 className={style.pageButton}
>
 -
</button>
{[...Array(totalPages)].map((_, index) => (
 <button
   key={index}
   onClick={() => paginate(index + 1)}
   className={style.pageButton}
   style={{
     fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
   }}
 >
   {index + 1}
 </button>
))}




<button
 onClick={() => paginate(currentPage + 1)}
 disabled={currentPage === totalPages}
 className={style.pageButton}
>
 Suivant
</button>
</div>
</div>
      </div>
      

      <div className={style.PieChart}>
    {/* Intégrer le camembert */}
    <PieChart userData={allUsers} />
      </div>

      <div className={style.PieChart2} >
     
      <p>Variations d'activité par secteur</p>
      <p>Analyse détaillée par secteur</p>
      <PieChart2 userData={allUsers} selectedService={selectedService} className={style.pie2} />
    </div>

{modal_send_notif &&(
    <div className={style.modal_container_profile}>
           <div className={style.modal_container_rec_offre}>
 <div className={style.flexing}>
 {/* Formulaire d'envoi de notification */}
 <div className={style.notificationContainer}>
   <h2> Envoyer une notification générale </h2>
   <p>
   "Attention : Évitez les saisies incorrectes ou inappropriées."</p>
   <textarea
     value={message}
     onChange={(e) => setMessage(e.target.value)}
     placeholder="Entrez votre message de notification..."
     maxLength={70}
     className={style.notificationInput}
   />

<div>
<button onClick={sendnotif} className={style.sendNotificationButton}>Envoyer  </button>
<button onClick={handleClose_notif} className={style.sendNotificationButton}>  Fermer</button>
  </div>
 
 </div>
 
 </div>
</div>
</div>

)}
     




    </div>
  );
}
