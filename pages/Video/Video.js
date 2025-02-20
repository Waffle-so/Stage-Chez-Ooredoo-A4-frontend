import style from '../../styles/Video.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState,useMemo,useRef } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Image from 'next/image';
import Playlist from '../Playlist/Playlist';


export default function Video({setpage,username,userprenom}) {
    const router = useRouter();
    const { id , nom, prenom, photoprofil, userId ,userIdd,type ,id_Playlist,imagePatth}  = router.query;
    const [videoDetails, setVideoDetails] = useState(null);
    const [userDetails, setUserDetails] = useState({ nom, prenom, photoprofil ,userIdd}); // Initialize with query values
    const [videos, setVideos] = useState([]);
    const [all_users, set_all_users]=useState([]);
    const [all_comments, set_all_comments]=useState([]) || [];
    const [Commentaire,setCommentaire]=useState('');
    const [showReplies, setShowReplies] = useState({});
    const [Type_com,setType_com]=useState('Question');
    const [err_comment,set_err_comment]=useState('');
    const [replyCommentId, setReplyCommentId] = useState(null);


    const [newNomVideo,setNewNomVideo]=useState('');
    const [newDescription,setNewDescription]=useState('');
    const [modal_modifier_video,set_modal_modifier_video]=useState(false);
    const [newImagePath, setNewImagePath] = useState(null);
    const [newFile, setNewFile] = useState(null);



    const allowedTypes2 = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/jfif',
        'image/webp',
    ];
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (allowedTypes2.includes(file.type)) {
                setNewImagePath(file.name);
                setNewFile(file);
            } else {
                alert('Type de fichier non autorisé.');
                setNewImagePath(null);
                setNewFile(null);
            }
          if (file.size > 50 * 1024 * 1024) { // 50 Mo
            alert('Le fichier dépasse la taille maximale de 50 Mo.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            setNewImagePath(e.target.result); // Met à jour l'état avec l'URL de l'image
          };
          reader.readAsDataURL(file);
          setNewFile(file);
        }
      };

    const handle_modal_modifier_video=()=>{
        set_modal_modifier_video(true);
        setNewNomVideo(NomVideo);
        setNewDescription(Description);
    }
    const handle_close_modal_modifier_video=()=>{
        set_modal_modifier_video(false);
    }

    const [isOpen, setIsOpen] = useState(false);

const toggleSidebar = () => {
    setIsOpen(!isOpen);
};

    const handleLoadedMetadata = () => {
        const duration = videoRef.current.duration; // Durée en secondes
        setVideoDuration(duration);
        console.log("Durée de la vidéo :", duration, "secondes");
      };
      
    const [videoDuration, setVideoDuration] = useState(0);
    const videoRef = useRef(null);

     // Fonction pour convertir les secondes en minutes et secondes
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} et ${remainingSeconds} seconde${remainingSeconds !== 1 ? 's' : ''}`;
  };



    const [viddeo , setviddeo]=useState(null);
   
 
    const [pagee,setpagee]=useState('');
    const navigate = async (pageName, params = {}) => {
        setpage(pageName);
        setpagee(pageName + ' >');
        localStorage.setItem('currentPage', pageName);
      
        await Router.push({
          pathname: `/Page_One_For_All`,
          query: { page: pageName, ...params },  // Ajout des paramètres dans la query
        }, undefined, { shallow: true });
    };
    

    const handleVideoClick = async (videoId, userId) => {
        // Utilisation de navigate en tant que fonction asynchrone
        await navigate('Video', {
            id: videoId,
            userId: userId,
            userIdd: userIdd,
            type: 'video'
        });
    
        Router.reload(router.asPath);
    };


    
    const imagePath = useMemo(() => {
        const imageName = userDetails.photoprofil ? userDetails.photoprofil.split(/[/\\]/).pop() : 'default-profile.jpg'; 
        const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, ''); 
        return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;
        
      }, [userDetails.photoprofil]);
     

      useEffect(() => {
        const fetchData = async () => {
            if (id) {
         
                    fetchVideoDetails(id);
                    fetch_comment(id);
                    get_video();
                    fetch_all_user();
            }
        };
    
        fetchData();
    }, [id]);
    
 
    
    
    
    useEffect(() => {
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId,userIdd]);

   

    const fetchVideoDetails = async (videoId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_video_by_id`,
                { id: videoId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setVideoDetails(response.data.video);
                console.log('Détails de la vidéo récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails de la vidéo');
              //  router.push('../Login/Login');
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des détails de la vidéo' , err);
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
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_info`,
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


    const fetch_all_user = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_user`,
                {}, // Pas besoin de données supplémentaires ici
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                // Mise à jour de l'état avec tous les utilisateurs récupérés
                set_all_users(response.data.Users);
                console.log('Détails de tous les utilisateurs récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des détails des utilisateurs');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
    };


    const fetch_comment = async (videoId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_comment_by_video_id`,
                {id: videoId }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                // Mise à jour de l'état avec tous les utilisateurs récupérés
                set_all_comments(response.data.Comments);
                console.log(' tous les commentaires récupérés avec succès');
            } else {
                console.error('Erreur lors de la récupération des commentaires des utilisateurs');
            }
        } catch (err) {
            console.error('Erreur lors de la requête :', err);
        }
    };
    
      const Add_comment =async()=>{
        try{

            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                router.push('../Login/Login');
                return;
            }

            if(!Commentaire){
                console.log('Ecriver d abord un commentaire avant envoyer !');
            }

            if (Commentaire.length > 400) {
                set_err_comment('Commentaire beaucoup trop long !');
                alert('Commentaire beaucoup trop long !')
                return;
            }

            
            if (!userIdd) {
                console.log(userIdd);
                console.error("userIdd est undefined ou null. Assurez-vous que l'utilisateur est bien connecté.");
                return;
            }

            const Videoid = router.query.id;

            // Définir le Type_com en fonction de la réponse ou non
             const type = replyCommentId ? 'Réponse' : 'Question';

            axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_comment`,{
                id_User : userIdd,
                id_Video : Videoid,
                Commentaire : Commentaire,
                Type_com: type,
                ParentId: replyCommentId || null, // Associe la réponse au commentaire parent
                username : username,
                userprenom : username,
        
              },{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
              }).then(()=> {
                    
                console.log("données insérées avec succées !");})
                Router.reload();

        }catch(err){
            console.error('Erreur lors de l envoie du commentaire : ', err);
        }
      }



      const handleSubmit_modifier_video = async (id,userId,nomVideo,description,file) => {

        
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login2/Login2');
            return;
        }
       

        if (!newNomVideo || !newDescription || !newFile) {
          alert('Veuillez remplir tous les champs et sélectionner une image.');
          return;
        }

        if (newFile.size > 50 * 1024 * 1024) { // 50 Mo
            alert('Le fichier dépasse la taille maximale de 50 Mo.');
            return;
          }
    
        const formData = new FormData();
        formData.append('id', id);
        formData.append('nomVideo', newNomVideo);
        formData.append('description', newDescription);
        formData.append('file', newFile);
    
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/update_video`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },

          });
          if (response.data.success) {
            alert('Vidéo mise à jour avec succès.');
            handle_close_modal_modifier_video();
            Router.push('/Page_One_For_All?page=Formation');
          } else {
            alert('Erreur lors de la mise à jour de la vidéo.');
          }
        } catch (error) {
          console.error('Erreur lors de la requête :', error);
          alert('Erreur lors de la mise à jour de la vidéo.');
        }
      };


    

    const get_video = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                Router.push('/Login/Login');
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/user_videos`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const LatestVideo = response.data.Video.slice(-8);
                setVideos(LatestVideo);
            } else {
                console.log('Erreur lors de la récupération des vidéos');
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!videoDetails) return <p>Loading...</p>;
 

    const url = videoDetails.Contenu_URL;
    const NomVideo = videoDetails.Nom_publication;
    const Date_poste = videoDetails.Date_poste;
    const Description = videoDetails.Description;

    

    const VIDEONAME = url.split(/[/\\]/).pop(); 
    const cleanedImageName = VIDEONAME.replace(/^(public\/)?(files\/)?/, ''); 
    const VIDEOpATH = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;


    

   
    //console.log(userDetails);


    const handledeletecomment = async (id_comment) => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token non trouvé");
          return;
        }
      
        try {
          // Appel de l'API pour supprimer la vidéo
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_comment`,
            { id_comment,username,userprenom }, // Envoyer un objet avec la clé id_vid
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", // Utiliser le bon type de contenu
              },
            }
          );
        
          console.log("Commentaire supprimée avec succès:", response.data);
          Router.reload();
          // Mettre à jour l'interface utilisateur ou recharger la page si nécessaire
        } catch (err) {
          console.error("Erreur lors de la suppression du commentaire:", err);
        }
      };

      

  
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const datePosted = new Date(dateString);
        const seconds = Math.floor((now - datePosted) / 1000);
    
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `posté il y a ${interval} ans`;
    
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `posté il y a ${interval} mois`;
    
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `posté il y a ${interval} jours`;
        if (interval === 1) return `posté il y a 1 jour`;
    
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `posté il y a ${interval} heures`;
        if (interval === 1) return `posté il y a 1 heure`;
    
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `posté il y a ${interval} minutes`;
        if (interval === 1) return `posté il y a 1 minute`;
    
        return `posté il y a quelques secondes`;
    };
//console.log(all_users);

    
    return (
        <div className={style.background_video_div}>
            <div className={style.div_all_video}>

           
          
            <div className={style.div_unique_vid}>
            <button onClick={() => router.push('../Page_One_For_All?page=Formation')} style={{ cursor: 'pointer', marginBottom: '20px' }}>
                ← Back
            </button>

                
                <div className={`${style.grid} ${isOpen ? style.videoWithSidebarOpen : ''}`}>
                    <h1>{NomVideo}</h1>
                </div>
                <div className={`${style.div_de_la_video} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.div_de_la_video_after : ''}`}>
                    <video ref={videoRef} controls className={style.video} onLoadedMetadata={handleLoadedMetadata}>
                        <source src={VIDEOpATH} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                </div>
               
    

               
                <div className={`${style.flexing} ${isOpen ? style.videoWithSidebarOpen : ''}`}>
                        <img src={imagePath || '/default-profile.jpg'} alt="Photo de profil" className={style.pdp} />
                        <p>{userDetails.nom} {userDetails.prenom}</p>


{userIdd == userDetails.id && type !=='playlist' && (
<button className={`${style.button_modifier_video} ${isOpen ? style.button_modifier_video_after : ''}`} style={{cursor: 'pointer'}} onClick={handle_modal_modifier_video}> Modifier la vidéo </button>
)}

{modal_modifier_video && (
    <div className={style.modal_container_modifier_video}>
        <div className={style.modal_modifier_video}>
            
            {/* Partie droite du modal */}
            <div className={style.modal_modifier_video_left}>
                <div className={style.modal_modifier_video_header}>
                    <h2>Modifier la vidéo</h2>
                </div>

                <div className={style.modal_modifier_video_body}>
                    {/* Champs de saisie */}
                    <label>Nouveau nom pour la vidéo <span style={{color: 'red'}}> (max 70 caractères)</span></label>
                    <input 
                        type="text"
                        placeholder="Nom de la vidéo"
                        value={newNomVideo}
                        onChange={(e) => setNewNomVideo(e.target.value)}
                        maxLength={70}
                    />
                    <br/>

                    <label>Nouvelle description pour la vidéo <span style={{color: 'red'}}> (max 700 caractères)</span></label>
                    <textarea
                        placeholder="Description de la vidéo"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        maxLength={700}
                    />
                    <br/>

                    {/* Section miniatures */}
                    <div className={style.flexing_miniature}>
                        
                       
                    
                        <div className={style.fileUpload}>
                        <label>Miniature de la vidéo</label><br/>
                        <p>La taille de la miniature ne doit pas dépasser 1000x1000 pixels (png ,jpg, jpeg, webp, jfif) </p>

                            <input
                                type="file"
                                id="newFileInput"
                                name="file"
                                className={style.hiddenFileInput}
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="newFileInput"
                                className={style.newFileLabel}
                                style={{ backgroundImage: `url(${newImagePath || '/default-image.jpg'})` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Partie gauche du modal */}
            <div className={style.modal_modifier_video_right}>
                <div 
                    className={style.customFileLabel}
                    style={{ backgroundImage: `url(${imagePatth})` }}
                />
                <h2>Informations</h2>
                <div className={style.modal_modifier_video_right_label}> 
                    <label> Nom de la vidéo </label>
                <p> {NomVideo}</p>
                <label> Description de la vidéo </label>
                <p> {Description}</p>
                    </div>
               

                <div className={style.modal_modifier_video_footer}>
                    <button 
                        onClick={handle_close_modal_modifier_video}
                        style={{ cursor: 'pointer' }}
                    >
                        Fermer
                    </button>
                    <button onClick={() => handleSubmit_modifier_video(videoDetails.id,userIdd,newNomVideo,newDescription,newFile)} style={{ cursor: 'pointer' }}>
                        Modifier
                    </button>
                </div>
            </div>

        </div>
    </div>
)}



    <a href={VIDEOpATH} download className={`${style.downloadButton} ${isOpen ? style.downloadButton_after : ''}`}>
        Télécharger <Image 
                className={style.logo_download}
                src='/vers-le-bas.png'
                width={250}
                height={250}
                alt=" telecharger video"
                priority
            />
    </a>

                    </div>
               
                <div className={`${style.Description} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.Description_after : ''}`}>
                    <h5>Description</h5> <h4>{getTimeAgo(Date_poste)}</h4>
                    <p className={style.description_texte}>{Description}</p>
                </div>

               
                <div className={`${style.commentaire_div} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.commentaire_div_after: ''}`}>
                    <h3> {all_comments.length} Commentaires</h3>
                    <textarea type='text' placeholder='Commentaire' onChange={e=>{setCommentaire(e.target.value)}}  maxLength={400} />
                    <button onClick={Add_comment} > Ajouter Un Commentaire </button>

                
                    <div className={`${style.commentaire} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.commentaire_after: ''} `}>
                        
                    {all_comments
                     .filter(comment => comment.Type_com === 'Question')
                    .map((comment)=>{
                       const user = all_users.find(user => user.id === comment.id_User);

                       const userProfileImage =  user ? user.photoprofil :'' ; // Obtenez le chemin de la photo de profil
                       const imageName = userProfileImage ? userProfileImage.split(/[/\\]/).pop() : ''; 
                       const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, '');
                       const imamagePath = userProfileImage ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}` : '';
                       return(
                       
                            <div  key={comment.id}  className={`${style.commentaire_individuel} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.commentaire_individuel_after : ''}`}>
                            <div className={style.flexing_comment}>
                            <img src={user ? `${imamagePath}` : '/default-profile.jpg'} alt="Photo de profil" className={style.pdp} />
                            <p>{user ? `${user.nom} ${user.prenom}` : 'Utilisateur inconnu:'}</p>
                            <p> {getTimeAgo(comment.Date_poste)}</p>
                            
                            {userIdd == comment.id_User && (
                        <button onClick={(() => handledeletecomment(comment.id))} style={{ cursor: 'pointer' }} > <Image
                        className={style.reply_pic}
                        src="/trash.png"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        priority
                      /> <p>Supprimer</p></button>
                        )}
                         <button onClick={() => setReplyCommentId(comment.id)} style={{ cursor: 'pointer' }} > <Image
                className={style.reply_pic}
                src="/reply.png"
                width={100}
                height={100}
                alt="Picture of the author"
                priority
              /> <p> Répondre </p> </button>
                         
                            </div>
                           
                           
                           
                        <p className={`${style.text_comment} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.text_comment_after : ''}`}> <label>{comment.Type_com}</label>  {comment.Commentaire}</p>


                        <div 
                        className={`${style.but_show_replies} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.but_show_replies_after : ''}`}><button  onClick={() => setShowReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                {showReplies[comment.id] ? 'Masquer la réponse' : 'Afficher la réponse'}
              </button>
                            </div>


                        {/* Boîte de réponse */}
          {replyCommentId === comment.id && (
            <div className={`${style.replyBox} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.replyBox_after : ''}`} >
            <div >
              <textarea
                type="text"
                placeholder="Écrire une réponse..."
                value={Commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                maxLength={400}
                className={style.textarea_reply}
              /><br/>
              <button onClick={() => Add_comment()}>Envoyer</button>
            </div>
            </div>
          )}

                  {/* Affichage des réponses */}
            {showReplies[comment.id] &&
              all_comments
                .filter(reply => reply.ParentId === comment.id && reply.Type_com === 'Réponse')
                .map(reply => {
                  const replyUser = all_users.find(user => user.id === reply.id_User);
                  const replyUserProfileImage = replyUser ? replyUser.photoprofil : '';
                  const replyImageName = replyUserProfileImage ? replyUserProfileImage.split(/[/\\]/).pop() : '';
                  const replyCleanedImageName = replyImageName.replace(/^(public\/)?(files\/)?/, '');
                  const replyImagePath = replyUserProfileImage ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${replyCleanedImageName}` : '';

                  return (
                    <div key={reply.id} className={style.reply}>
                      <div className={style.flexing_comment}>
                        <img src={replyUser ? `${replyImagePath}` : '/default-profile.jpg'} alt="Photo de profil" className={style.pdp} />
                        <p>{replyUser ? `${replyUser.nom} ${replyUser.prenom}` : 'Utilisateur inconnu:'}</p>
                        <p>{getTimeAgo(reply.Date_poste)}</p>
                        
                        
                        {userIdd == reply.id_User && (
                        <button onClick={(() => handledeletecomment(reply.id))} style={{ cursor: 'pointer' }} > <Image
                        className={style.reply_pic}
                        src="/trash.png"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                        priority
                      /> <p>Supprimer</p></button>
                        )}
                         
                      </div>

                      <p className={style.text_reply}>
                        <label>{reply.Type_com}</label> {reply.Commentaire}
                      </p>

                      


                      
                    </div>
                    
                  );
                })}     
                        </div>
                       )
                    })}
                    </div>

                </div>
            </div>

         
<div>

 
   

    {type === 'playlist'  ?(
        <>
       <div className={style.but_sidebar}>
       <button
            className={`${style.toggleButton} ${isOpen ? style.videoWithSidebarOpen : ''} ${isOpen ? style.toggleButton_after : ''}`}
            onClick={toggleSidebar}
        >
            <p className={style.toggleButton_p}>{isOpen ? '←' : '→'} Playlist  </p>
        </button>

       </div>
         

        <div className={`${style.sidebar} ${isOpen ? style.open : style.closed}`}>
        

        {isOpen && (
            <div className={style.Playlist}>
                <h2>Playlist</h2>
                <Playlist userIdd={userIdd} setpage={setpage} />
            </div>
        )}
    </div>

        </>
        
       

    ):null}
             

          
</div>
           
            </div>
        </div>
    );
}
