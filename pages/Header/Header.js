import style from '../../styles/Header.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Router from 'next/router';
import axios from 'axios';

export default function Header({ user_Gmail,username, userprenom,user_image, userIdd,setpage, notificationCount, user_role }) {
  const router = useRouter();
  const [pagee, setpagee] = useState('');
  const [filteredVideos, setFilteredVideos]=useState([]);
  const [videos, setVideos]=useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);



  const navigate = (pageName) => {
    setpage(pageName);
    setpagee(pageName + ' >');
    localStorage.setItem('currentPage', pageName);
    router.push(`/Page_One_For_All?page=${pageName}`, undefined, { shallow: true });
  };

  const navigate2 = (pageName, params = {}) => {
    setpage(pageName);
    setpagee(pageName + ' >');
    localStorage.setItem('currentPage', pageName);
    
    Router.push({
      pathname: `/Page_One_For_All`,
      query: { page: pageName, ...params }, 
    }, undefined, { shallow: true });
  };
  

  const menuItems = [
    { name: 'Acceuil', pageName: 'Acceuil' },
    { name: 'Formation', pageName: 'Formation' },
    user_role && user_role !== 'Administrateur' ? { name: 'Report', pageName: 'Report' } : null,
    user_role && user_role !== 'Administrateur' ? { name: 'Objectif', pageName: 'Objectif' } : null,
    user_role === 'Administrateur' ? { name: 'Dashbord', pageName: 'Dashbord' } : null,
    user_role === 'Administrateur' ? { name: 'Logs', pageName: 'Logs' } : null,
  ].filter(Boolean); // Supprime les éléments nulls.


  useEffect(() => {
      get_video();
  }, []);


  const get_video = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé');
        router.push('/Login/Login');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_videos`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const videos = response.data.Video || [];
        setVideos(videos);
        setFilteredVideos(videos); // Initialiser avec les 5 premiers

      } else {
        console.error('Erreur lors de la récupération des vidéos');
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    // Filtrer les vidéos en fonction de la recherche et de la catégorie
    const filtered = videos.filter(
      (video) =>
        video.Catégorie === 'Video' && // Vérifie si la catégorie est "Video"
        video.Nom_publication.toLowerCase().includes(searchTerm.toLowerCase()) // Vérifie le terme de recherche
    );
    setFilteredVideos(filtered); // Ne limitez pas ici
  }, [searchTerm, videos]);
  
  


  const getProfileImagePath = (profilePath) => {
   // console.log('Profile path:', profilePath); // Log pour vérifier le chemin
    if (!profilePath) return '/default-profile.jpg'; // Chemin d'image par défaut
    const profileImageName = profilePath.split(/[/\\]/).pop();
    const cleanedProfileImageName = profileImageName.replace(/^(public\/)?(files\/)?/, '');
    return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedProfileImageName}`;
  };
  
 // Fonction pour gérer le clic sur une vidéo
 const handleVideoClick = async (videoId, userId) => {
  try {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    setSelectedVideoId(videoId);
    setSelectedUserId(userId);

    // Récupérer les informations de l'utilisateur en utilisant l'ID de l'utilisateur
    const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/profile`, 
     {
      params: {
        userId: userId,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        
      },
    },);

    if (response.data.success) {
      const user = response.data.user;

   
      navigate2('Video', {
        id: videoId,
        nom: user.nom,
        prenom: user.prenom,
        photoprofil: user.photoprofil,
        userId: user.id,
        userIdd: userIdd,
        userName: user.nom,
        userPrenom: user.prenom,
        userRole: user.role,
        type: 'Video',
      });

    } else {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur');
    }
  } catch (error) {
    console.error('Erreur dans handleVideoClick:', error);
  }
};


  return (
    <>
      <div className={style.body}>
        <div className={style.background_fixed}></div>
        <header className={style.header}>
          <div className={style.div_in_header}>
            <div className={style.div_logo}>
              <Image
                className={style.ooreedoo}
                src="/ooredoo-removebg-preview.png"
                width={400}
                height={400}
                alt="Picture of the author"
                onClick={() => navigate('Profile')}
                priority
              />
              <p className={style.p_page_name}>{pagee} </p>
            </div>

            <ul className={style.ul}>
              {menuItems.map((item) => (
                <li
                  key={item.pageName}
                  className={`${style.li} ${router.query.page === item.pageName ? style.active : ''}`}
                  onClick={() => navigate(item.pageName)}
                >
                  {item.name}
                </li>
              ))}
            </ul>

            <input
              type="text"
              placeholder="Search..."
              className={style.input_search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Capture l'entrée utilisateur
            />

 {/* Afficher les résultats uniquement si `searchTerm` n'est pas vide */}
 {searchTerm && (
  <div className={style.search_results}>
    {filteredVideos.length > 0 ? (
      filteredVideos.slice(0, 4).map((video, index) => (
        <div 
          key={index} 
          className={style.video_item}  
          onClick={() => handleVideoClick(video.id, video.id_User)}
        >
          <Image
    className={style.miniature}
    src={video.miniature 
        ? getProfileImagePath(video.miniature) 
        : getProfileImagePath(video.image)} // Chemin de l'image par défaut
    width={200}
    height={200}
    alt="Miniature de la vidéo"
    priority
    style={{ cursor: 'pointer' }}
/>

          <div>
            <p  style={{ cursor: 'pointer' }}>{video.Nom_publication}</p>
            <p className={style.Date_poste}>{video.Date_poste.slice(0, 10)}</p>
          </div>
        </div>
      ))
    ) : (
      <div  className={style.video_item}  >
         <Image
            className={style.miniature}
            src='/stars.jpg'
            width={200}
            height={200}
            priority
          /> 
        <div>
          <p></p>
          <p>Aucune publication disponible </p>
        </div>
      
      </div>
    )}
  </div>
)}



<Image
              className={style.profile}
              src="/profile.png"
              width={80}
              height={80}
              alt="Picture of the author"
              onClick={() => navigate('Profile')}
              priority
            /> 
            

            <div className={style.flex_notif}>
              <Image
                className={style.notif}
                src="/notif.png"
                width={50}
                height={50}
                alt="Picture of the author"
                priority
              />
              {notificationCount > 0 && (
                <div className={style.notif_count}> {notificationCount}</div>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
