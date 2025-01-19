import style from '../styles/Page_For_All.module.css' ;
import { useState, useEffect,useMemo, use } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import io from 'socket.io-client';
import Image from 'next/image';

const Sidebar = dynamic(() => import('./AppSideBar'), { ssr: false });



/*npm run dev*/
// Importation dynamique des pages pour optimiser le chargement
const AcceuilPage = dynamic(() => import('./Ooredoo/Acceuil/Acceuil'), { loading: () => <p>Chargement...</p> });
const FormationPage = dynamic(() => import('./Formation/Formation'), { loading: () => <p>Chargement...</p> });
const ReportPage = dynamic(() => import('./Report/Report'), { loading: () => <p>Chargement...</p> });
const ProfilPage = dynamic(() => import('./Profile/Profile'), { loading: () => <p>Chargement...</p> });
const VideoPage = dynamic(() => import('./Video/Video'), { loading: () => <p>Chargement...</p> });
const PlaylistPage = dynamic(() => import('./Playlist/Playlist'), { loading: () => <p>Chargement...</p> });
const DashbordPage = dynamic(() => import('./Dashbord/Dashbord'), { loading: () => <p>Chargement...</p> });
const LogsPage = dynamic(() => import('./Log/Log_Page'), { loading: () => <p>Chargement...</p> });
const Profile_visit = dynamic(() => import('./Profile/Profile_visit'), { loading: () => <p>Chargement...</p> });
const Objectif = dynamic(() => import('./Objectif/Objectif'), { loading: () => <p>Chargement...</p> });
const Objectif2 = dynamic(() => import('./Objectif/Objectif2'), { loading: () => <p>Chargement...</p> });

export default function Page_One_For_All({}){
  const Router = useRouter();
  const { query } = Router;  // Utilisation de useRouter pour récupérer les paramètres de l'URL

  const [currentPage, setCurrentPage] = useState('Acceuil');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // État de chargement
  const [userId, SetUserId] = useState('');
  const [username, SetUserName] = useState('');
  const [userprenom, SetUserPrenom] = useState('');
  const [usersecteur, setUserSecteur] = useState('');
  const [usertelephone, SetUsertelephone] = useState('');
  const [userdate, SetUserdate] = useState('');
  const [user_image, set_image_set] = useState('');
  const [user_role, set_user_role] = useState('');
  const [user_Gmail, set_user_Gmail] = useState('');
  const [user_Change_mdp, set_Change_mdp] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Initialisation de l'état pour le dark mode.

  const [userfile_id,setuserfile_id]=useState([]);
  const [userfile_path,setuserfile_path]= useState([]);
  const [userfile_size,setuserfile_size]= useState([]);
  const [userfile_type,setuserfile_type]= useState([]);


  const [newpass,setnewpass]=useState('');
  const [confirmnewpass,setconfirmnewpass]=useState('');
  const [message,setMessage]=useState('');
  
  
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotificationCountChange = (count) => {
    setNotificationCount(count);
  };

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [visibleNotifications, setVisibleNotifications] = useState(null);

  const [ModalchangeMDP, setModalchangeMDP] = useState(false);


   /*DEBUT MODAL modal */ 
   const handleopen_modal = () => { setModalchangeMDP(true); };
   const handleClose_modal = () => {  setModalchangeMDP(false);};
/*FIN*/ 

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

    setSocket(newsocket);


    return () => {
      newsocket.disconnect();
    };
  }, [Router]);


  // Écouter les notifications
  useEffect(() => {
    if (socket) {
      const handleReceiveNotification = (data) => {
        const {message} = data;

        if (message){
          console.log("message :",message);
          setVisibleNotifications(data); 
        }
        console.log('Notification reçue :', data);
       
      };

      socket.on('/api/receive_notif', handleReceiveNotification);

      // Nettoyer l'écouteur à la déconnexion
      return () => {
        socket.off('/api/receive_notif', handleReceiveNotification);
      };
    }
  }, [socket]);
  
  useEffect(() => {
    if (notifications.length > 0) {
      const interval = setInterval(() => {
        setVisibleNotifications((prev) => {
          if (prev.length < notifications.length) {
            return [...prev, notifications[prev.length]];
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000); // Affiche une notification toutes les 1 seconde
    }
  }, [notifications]);

  const removeNotification = () => {
    setVisibleNotifications(null)
  };
  



  const [page, setpage] = useState('Acceuil'); // Initialiser à 'Acceuil' par défaut
 
  useEffect(() => {
    // Récupère la page depuis localStorage au premier chargement
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setpage(savedPage);
    }
  }, []);
  


useEffect(() => {
  // Sauvegarde la page actuelle à chaque changement de la variable page
  localStorage.setItem('currentPage', page);
}, [page]);
useEffect(() => {
  // Vérifie l'URL pour voir si une page est définie en paramètre
  const { page } = Router.query;
  if (page) {
    setpage(page);
  } else {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setpage(savedPage);
    } else {
      setpage('Acceuil'); // Page par défaut si aucune page n'est enregistrée
    }
  }
}, [Router.query]);

  
  const authentificate = async() =>{
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            Router.push('/Login2/Login2');
            return;
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/profile`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            SetUserId(response.data.user.id);
            SetUserName(response.data.user.nom);
            SetUserPrenom(response.data.user.prenom);
            setUserSecteur(response.data.user.secteur);
            SetUsertelephone(response.data.user.telephone);
            SetUserdate(response.data.user.date_de_naissance);
            set_image_set(response.data.user.photoprofil);
            set_user_role(response.data.user.role);
            set_user_Gmail(response.data.user.Gmail);
            set_Change_mdp(response.data.user.Mdp_change);
            setLoggedIn(true);
         
        } else {
            setLoggedIn(false);
            Router.replace('/Login2/Login2');
           
        }
    } catch(err) {
        console.log(err);
        setLoggedIn(false);
        Router.replace('/Login2/Login2');
      
    } finally {
        setLoading(false); // Fin du chargement
    }
}




const Find_Files = async() =>{
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error("Token non trouvé");
          return;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_files`, {}, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      if (response.data.success) {
        const files =response.data.File || [];
        setuserfile_id(files.map(File=>File.id));
        setuserfile_path(files.map(File=>File.file_path));
        setuserfile_size(files.map(File=>File.file_size));
        setuserfile_type(files.map(File=>File.file_type));
        

      } else {
        console.log('les fichiers non pas été retrouver ! ');
        setLoggedIn(false);
        Router.push('/Login2/Login2');
      }
  } catch(err) {
      console.log(err);
      setLoggedIn(false);
      Router.push('/Login2/Login2');
  }
}



  // Fonction pour ajouter un projet
  const handle_change_mdp = async () => {
   
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            Router.push('../Login2/Login2');
            return;
        }

         // Vérifier si les mots de passe correspondent côté client
    if (newpass !== confirmnewpass) {
      console.error('Les mots de passe ne correspondent pas');
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
 // Vérifier la longueur des mots de passe côté client
 if (newpass.length < 10 || newpass.length > 30) {
  console.error('La longueur du mot de passe est invalide');
  setMessage('Le mot de passe doit contenir entre 10 et 30 caractères');
  return;
}

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/change_mdp`,
            {    username:username,
              userprenom:userprenom, 
                 newpass : newpass ,
                 confirmnewpass : confirmnewpass,
                },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log('Mot de passe changed successfully:', response.data);
        Router.reload();
    } catch (err) {
        console.error('Erreur lors du changement du mot de passe :', err);
        setMessage('Erreur lors du changement du mot de passe');
    }}


useEffect(() => {
  const initializeData = async ()=> {
    await Promise.all([ authentificate(), Find_Files()]);
    setLoading(false);
  };
  initializeData();
}, []);

  // Effet pour sauvegarder le mode dans le localStorage et l'appliquer au démarrage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);



if (loading) {
  return <div>Chargement...</div>; // Montre un écran de chargement ou un skeleton
}
if (!loggedIn) {
  return null; // Évite de rendre le contenu si l'utilisateur n'est pas connecté
}


  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode); // Sauvegarde dans le localStorage
      return newMode;
    });
  };


  

    // Render page content directly based on `page`
    const renderPageContent = () => {
      switch (page) {
          case 'Acceuil':
              return <AcceuilPage username={username} userprenom={userprenom} usersecteur={usersecteur} userfile_id={userfile_id} notificationCount={notificationCount} user_role={user_role} />;
          case 'Formation':
              return <FormationPage username={username} userprenom={userprenom} user_image={user_image} userIdd={userId} setpage={setpage} user_role={user_role} />;
          case 'Video':
              return <VideoPage setpage={setpage} username={username} userprenom={userprenom} />;
          case 'Publication':
              return <PublicationPage />;
          case 'Playlist':
              return <PlaylistPage userIdd={userId} setpage={setpage} username={username} userprenom={userprenom} />;
          case 'Report':
              return <ReportPage username={username} userprenom={userprenom} userIdd={userId} user_role={user_role} usersecteur={usersecteur} />;
          case 'Dashbord':
              return <DashbordPage userIdd={userId} username={username} userprenom={userprenom} />;
          case 'Profile_visit':
              return <Profile_visit />; 
          case 'Logs':
              return <LogsPage username={username} userprenom={userprenom} userIdd={userId} user_role={user_role} />;
          case 'Profile':
              return <ProfilPage username={username} userprenom={userprenom} usersecteur={usersecteur} usertelephone={usertelephone} userdate={userdate} user_image={user_image} userfile_id={userfile_id} userfile_path={userfile_path} userfile_size={userfile_size} userfile_type={userfile_type} user_Gmail={user_Gmail} />;
          case 'Objectif':
                return <Objectif username={username} userprenom={userprenom} userIdd={userId} user_role={user_role} usersecteur={usersecteur}/>;
          case 'Objectif2':
                return <Objectif2 username={username} userprenom={userprenom} userId={userId} user_role={user_role} usersecteur={usersecteur}/>;
          default:
              return <h1>Page not found</h1>;
      }
  };

    return(
        <>
         <Header user_Gmail={user_Gmail} username={username} userprenom={userprenom} user_image={user_image} userIdd={userId} setpage={setpage} notificationCount={notificationCount} user_role={user_role}/>
         <Sidebar userId={userId} currentPage={currentPage} setPage={setCurrentPage} user_image={user_image} usersecteur={usersecteur} onNotificationCountChange={handleNotificationCountChange} username={username} userprenom={userprenom} user_Gmail={user_Gmail}/>

        <div className={darkMode ? `${style.all_div_here} ${style.darkModeClass}` : `${style.all_div_here} ${style.lightModeClass}`}>
           {/* Afficher les notifications reçues */}
         <button onClick={toggleDarkMode} className={style.btn_darkmode}>
          Basculer vers {darkMode ? 'Mode Clair' : 'Mode Sombre'}
        </button>


        {user_Change_mdp === true &&(
           <div className={style.modal_container_profile}>
            <div className={style.modal_container_rec_offre} >
              <h3> Changer le mot de passe de votre compte </h3>
              <p>Entrer un nouveau mot de passe pour <strong>{user_Gmail} </strong> </p>
              <input type='password' placeholder='Password ' onChange={(e)=> setnewpass(e.target.value)} /><br/>
              <input  type='password' placeholder='Confirmer votre password ' onChange={(e)=> setconfirmnewpass(e.target.value)}/><br/>
              <p>{message}</p>
              <p> Votre mot de passe doit : </p>
              <li> <Image
                        src='/checked.png'
                        alt="Profil"
                        width={190}
                        height={190}
                        style={{ borderRadius: '50%' }}
                        className={style.logo}
                      /> Avoir plus de 10 caractére </li>
              <li><Image
                        src='/checked.png'
                        alt="Profil"
                        width={190}
                        height={190}
                        style={{ borderRadius: '50%' }}
                        className={style.logo}
                      />  Avoir des majescules et miniscules </li>
              <li><Image
                        src='/checked.png'
                        alt="Profil"
                        width={190}
                        height={190}
                        style={{ borderRadius: '50%' }}
                        className={style.logo}
                      />  Au moins un nombre </li>

              <button onClick={()=> handle_change_mdp()}> Terminer </button>
              </div>
          
          </div>
        )}

       
           {visibleNotifications  ? (
             <div className={`${style.notif} ${style.notifVisible}`}>
              <p>!</p>
              <p>{visibleNotifications.message}</p>
              <button
                style={{ cursor: 'pointer' }}
                onClick={() => removeNotification()}
              >
                X
              </button>
            </div>
        
      ):(<p></p>)}
 
        <div className={style.middle}> {renderPageContent()}</div>
        <div className={style.right_page}></div>
        <Footer />
        </div>
         
 
      
        </>
    )
}