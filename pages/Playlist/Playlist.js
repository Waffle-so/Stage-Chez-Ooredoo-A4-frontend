import style from '../../styles/Playlist.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Router from 'next/router';

export default function Playlist({ userIdd , setpage,username, userprenom }) {
    const router = useRouter();
    const { id, nom, prenom, photoprofil, id_Playlist, Nom_playlist, userId } = router.query;
    const [userDetails, setUserDetails] = useState({ nom: '', prenom: '', photoprofil: '', userIdd: '' });
    const [playlistDetails, setPlaylistDetails] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [videoDurations, setVideoDurations] = useState({}); // Stocke les durées des vidéos par ID
    const videoRef = useRef(null);


    
    const [pagee,setpagee]=useState('');
    const navigate = (pageName, params = {}) => {
      setpage(pageName);
      setpagee(pageName + ' >');
      localStorage.setItem('currentPage', pageName);
      
      return Router.push({
        pathname: `/Page_One_For_All`,
        query: { page: pageName, ...params },  // Ajout des paramètres dans la query
      }, undefined, { shallow: true });
    };
    


    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} et ${remainingSeconds} seconde${remainingSeconds !== 1 ? 's' : ''}`;
    };

    const handleLoadedMetadata = (videoId, duration) => {
        if (!duration || isNaN(duration)) {
            console.error(`Durée non disponible pour la vidéo ID ${videoId}`);
            return;
        }
        setVideoDurations((prevDurations) => ({
            ...prevDurations,
            [videoId]: duration,
        }));
    };
    

    const imagePath = useMemo(() => {
        const imageName = userDetails.photoprofil ? userDetails.photoprofil.split(/[/\\]/).pop() : 'default-profile.jpg';
        const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, '');
        return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;
    }, [userDetails.photoprofil]);

    useEffect(() => {
        const fetchData = async () => {
            if (id_Playlist) {
                await fetchPlaylistDetails(id_Playlist);
                await fetchAllUsers();
            }
        };
        fetchData();
    }, [id_Playlist]);

    useEffect(() => {
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            playlistDetails?.forEach((video) => {
                if (!videoDurations[video.id]) {
                    setVideoDurations((prevDurations) => ({
                        ...prevDurations,
                        [video.id]: 0, // Durée par défaut si non disponible
                    }));
                }
            });
        }, 5000); // 5 secondes
    
        return () => clearTimeout(timeout);
    }, [playlistDetails, videoDurations]);
    

    const fetchPlaylistDetails = async (id_Playlist) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_playlist_videos`,
                { id: id_Playlist },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setPlaylistDetails(response.data.playlist.Publications);
                console.log('Détails de la playlist récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails de la playlist');
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des détails de la playlist', err);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/user_info`,
                { userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setUserDetails(response.data.user);
                console.log('Détails de l\'utilisateur récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails de l\'utilisateur');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_user`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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

    const getUserName = (id_user) => {
        const user = allUsers.find((user) => user.id === id_user);
        return user ? `${user.nom} ${user.prenom}` : 'Utilisateur inconnu';
    };

    const getImagePath = (id_user) => {
        const user = allUsers.find((user) => user.id === id_user);
        if (!user || !user.photoprofil) return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/default-profile.jpg`;
        
        const imageName = user.photoprofil.split(/[/\\]/).pop().replace(/^(public\/)?(files\/)?/, '');
        return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${imageName}`;
    };
    
    const handledeletevid_inplay = async (id_vid,id_play) => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token non trouvé");
          return;
        }
      
        try {
          // Appel de l'API pour supprimer la vidéo
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_vid_in_playlist`,
            { id_vid : id_vid , id_play : id_play,username:username, userprenom:userprenom }, // Envoyer un objet avec la clé id_vid
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", // Utiliser le bon type de contenu
              },
            }
          );
        
          console.log("Vidéo  dans la playlist supprimée avec succès:", response.data);
          Router.reload();
          // Mettre à jour l'interface utilisateur ou recharger la page si nécessaire
        } catch (err) {
          console.error("Erreur lors de la suppression de la vidéo dans la playlist :", err);
        }
      };

      const formatDate = (dateString) => {
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
    
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
    
        return `${day} ${month}`;
    };
    


    return (
        <div className={style.div_playlist_all}>

            <div className={style.playlist}><br/>
            <h1>{Nom_playlist} </h1>
                {playlistDetails ? (
                      <section className={style["table-container"]} id='table_container'>
                    <table className={style.tableau}>
                        <thead>
                            <tr className={style.tr}>
                                <th className={style.td}></th>
                                <th className={style.td}>Miniature</th>
                                <th className={style.td}>Nom de la Vidéo</th>
                                <th className={style.td}>Date</th>
                                <th className={style.td}>Utilisateur</th>
                                <th className={style.td}>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playlistDetails.length > 0 ? (
                                playlistDetails.map((video, index) => {
                                    const VIDEONAME = video.Contenu_URL.split(/[/\\]/).pop();
                                    const cleanedVideoName = VIDEONAME.replace(/^(public\/)?(files\/)?/, '');
                                    const VIDEOpATH = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedVideoName}`;

                                    const handlePlaylistClick = (idvid, iduserr) => {
                                        navigate('Video', {
                                            id: idvid,
                                            nom: nom,
                                            prenom: prenom,
                                            photoprofil: photoprofil,
                                            userIdd: userIdd,
                                            userId: iduserr,
                                            id_Playlist: id_Playlist,
                                            type: 'playlist',
                                            
                                        }).then(() => {
                                            Router.reload(); // Recharger la page après la navigation
                                        }).catch((error) => {
                                            console.error("Erreur lors de la navigation :", error);
                                        });
                                    };
                                    


                                   

                                    return (
                                        <tr key={video.id}  className={style.tr}>
                                            <td className={style.td}>#{index + 1}</td>
                                            <td className={style.td}>
                                            <Image
    src={
        video.miniature 
            ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${video.miniature}` 
            : `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${video.image}`
    }
    alt={video.Nom_publication}
    width={500}
    height={400}
/>

                                                 <video
                    src={VIDEOpATH}
                    preload="metadata"
                    onLoadedMetadata={(e) => handleLoadedMetadata(video.id, e.target.duration)}
                    style={{ display: 'none' }} 
                />
                                            </td>
                                           
                                            <td className={style.td}>
    <h2 
        onClick={() => handlePlaylistClick(video.id, video.id_User)}
        style={{ cursor: 'pointer' }}
    >
        {video.Nom_publication} <br/>
        <p>{videoDurations[video.id] ? formatDuration(videoDurations[video.id]) : 'Chargement...'}</p>
    </h2>
</td>
<td>{formatDate(video.createdAt)}</td>

                                            <td className={style.td}> <Image
                                                    src={getImagePath(video.id_User)}
                                                    className={style.pdp}
                                                    width={200}
                                                    height={200}
                                                    style={{ cursor: 'pointer' }} 

                                                />
                                                
                                                <p>{getUserName(video.id_User)} </p>
                                           
                                            </td>
                                            <td className={style.td}>
                                            <strong className={video.Types === 'Public' ? style.public : video.Types === 'Privée' ? style.privee : ''}> {video.Types} </strong>
                                            </td>
                                            <td>
                                            <a onClick={()=> handledeletevid_inplay(video.id,id_Playlist)}>
                                                <Image
                                                    src='/trash.png'
                                                    alt={video.trash}
                                                    className={style.trash}
                                                    width={200}
                                                    height={200}
                                                    style={{ cursor: 'pointer' }} 

                                                />
                                                </a>
                                           
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className={style.tr}>
                                    <td colSpan="5" className={style.td}>Aucune vidéo dans cette playlist.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </section>
                ) : (
                    <p>Chargement des détails de la playlist...</p>
                )}
            </div>
        </div>
    );
}
