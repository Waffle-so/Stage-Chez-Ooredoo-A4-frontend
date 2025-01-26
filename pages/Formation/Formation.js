import style from '../../styles/Formation.module.css' ;
import { useEffect,useState,useMemo } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function Formation({username, userprenom, user_image,userIdd,setpage,user_role}){
    const Router = useRouter();
    const [loadingVideos, setLoadingVideos] = useState(true);

    
    const [isModalOpen_video, setIsModalOpen_video] = useState(false);
    const [isModalOpen_video2, setIsModalOpen_video2] = useState(false);
    const [isModalOpen_sup_play, setIsModalOpen_sup_play] = useState(false);
    const [ismodalsup_open,setmodalsup_open]= useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null); 
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null); 
    const [selectedPlaylistNom, setSelectedPlaylistNom] = useState(null); 
    const [selectedUserId, setSelectedUserId] = useState(null); 
    const [selectedVideoName, setselectedNom_video] = useState(null); 
    const [isModalOpen_choiceplaylist, setIsModalOpen_choiceplaylist] = useState(false);
    const [isModalOpen_choisirprojet, setIsModalOpen_choisirprojet] = useState(false);

    const [selectedprojetfilter, setselectedprojetfilter]=useState('');
    const [selecteddocumentfilter, setselecteddocumentfilter]=useState('');

    const [isModalOpen_playlist, setIsModalOpen_playlist] = useState(false);
    const [recherche, setrecherche]=useState('');
    const [isImageAvailable, setIsImageAvailable] = useState(false);


    const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Videos');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Video');
    const [selected_mes_vides,set_selected_mes_videos]=useState('');
    const [selectedType,set_selected_Type_videos]=useState('Public');


    const [selectedOption, setSelectedOption] = useState('Public');

    const handleSelectChange = (e) => {
      setSelectedOption(e.target.value);
    };

    const [pagee,setpagee]=useState('');
    const navigate = (pageName, params = {}) => {
      setpage(pageName);
      setpagee(pageName + ' >');
      localStorage.setItem('currentPage', pageName);
      
      Router.push({
        pathname: `/Page_One_For_All`,
        query: { page: pageName, ...params }, 
      }, undefined, { shallow: true });
    };
    


    

    
    const [fileName, setFileName] = useState('No file chosen');
    const [fileSize, setFileSize] = useState('');
    const [file, setFile] = useState(null); 
    const [Nom_publication,set_nom_publication]=useState("");
    const [Description,set_Description]=useState("");
    const [miniature,set_miniature]=useState(null);
    const [isVideo, setIsVideo] = useState(false); 
    const [error_file,set_err_file] =useState('');
    const [uploadProgress, setUploadProgress] = useState(0); // Nouvel état pour la progression
    const [isUploading, setIsUploading] = useState(false); // Indique si un fichier est en cours d'upload

    const imagePath = useMemo(() => {
      const imageName = user_image.split(/[/\\]/).pop(); 
      const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, ''); 
      return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;
      
    }, [user_image]);

    const [selected, setSelected] = useState('All Videos'); 
    const [selected2, setSelected2] = useState('Video'); 
    const [selected3, setSelected3] = useState('All_videos'); 
    const [selected4, setSelected4] = useState('Public');
    const [selected5, setSelected5] = useState('');
    const [selected6, setSelected6] = useState('');
    


     /*recuperer toues video dans UseEffect pour pas surcharger page_one_for_all */
  const [videoId, setVideoId] = useState([]);
  const [videoUserId, setVideoUserId] = useState([]);
  const [Nom_video, SetNom_video] = useState([]);
  const [Date_poste, Setdate_poste] = useState([]);
  const [miniature_vid, set_miniature_vid] = useState([]);
  const [Type_vid,set_type_vid]= useState([]);
  const [n_pro_asso,set_n_pro_asso]= useState([]);
  const [id_projet_asso,set_id_projet_asso]= useState([]);
  const [image_asso,set_id_image_asso]= useState([]);
 /* Playlist */
  const [id_Playlist,setid_playlist]=useState('');
  const [Nom_playlist,setNomplaylist]=useState('');
  const [newplaylist,setnewplaylist]=useState('');
  const [playlist,setplaylist]=useState([]);
  const [playlistUserId, setplaylistUserid] = useState([]);
  const [err_playlist,set_err_playlist]=useState('');
/*Documents */
const [DocumentId, setDocumentId] = useState([]);
const [DocumentUserId, setDocumentUserId] = useState([]);
const [Nomdocument, SetNom_document] = useState([]);
const [date_poste_document, Setdate_poste_document] = useState([]);
const [type_doc,set_type_doc]= useState([]);
const [document_projet_asso,set_document_projet_asso]= useState([]);

  

  const [projet_asso,setprojet_asso]=useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null); 

   // Utilisation d'un objet pour stocker les informations utilisateur par ID
  const [userInfo, setUserInfo] = useState({});

const [videos, setVideos] = useState([]); 
const [filteredVideos, setFilteredVideos] = useState([]); 
const [filteredDocuments, setFilteredDocuments] = useState([]);
const [filteredPlaylist, setFilteredPlaylist] = useState([]);

const [currentPage, setCurrentPage] = useState(1);



const videosPerPage = 20; 
const DocumetnPerPage = 20; 
const PlaylistperPage = 20;


const itemsPerPage = 20; 
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Filtrer le tableau videoId en fonction de la page actuelle
const paginatedVideoId = videoId.slice(startIndex, endIndex);

const paginatedPlaylistId =id_Playlist.slice(startIndex,endIndex);

const paginatedDocumentId = DocumentId.slice(startIndex,endIndex);



const totalPages = Math.ceil(videoId.length / itemsPerPage);
const totalPages_playlist = Math.ceil(id_Playlist.length / itemsPerPage);
const totalPages_doc = Math.ceil(DocumentId.length / itemsPerPage);

    const allowedTypes = [
        'video/mp4',
        'video/webm', 
        'video/ogg',   
        'image/png',
        'image/jpeg', 
        'image/jfif' , 
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
    ];


    const allowedTypes2 = [
        'image/png',
        'image/jpeg',
        'image/jfif' 
    ];
    
    
const handleTimeFilterSelect = (filter) => {
  setSelectedTimeFilter(filter);
};

const handleCategoryFilterSelect = (filter) => {
  setSelectedCategoryFilter(filter);
};


const handlemesvideosFilterSelect = (filter) => {
  set_selected_mes_videos(filter);
};

const handleTypevideosFilterSelect = (filter) => {
  set_selected_Type_videos(filter);
};

const handleCategoryProjetSelect = (filter) => {
  setselectedprojetfilter(filter);
};

const handleCategoryDocumentSelect = (filter) => {
  setselecteddocumentfilter(filter);
};



useEffect(() => {
  const checkImageAvailability = async () => {
    try {
      const response = await axios.get(imagePath);
      if (response.status === 200) {
        setIsImageAvailable(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image :', error);
      setIsImageAvailable(false);
    }
  };

  checkImageAvailability();
}, [imagePath]);

useEffect(() => {
    get_playlist();
    get_video();
  
}, [selectedTimeFilter, selectedCategoryFilter,selected_mes_vides,selectedType]);

useEffect(() => {
    fetchAllProjets();
  
}, []); 



useEffect(() => {

  const filtered = videos.filter((video) => {
   
    const matchCategory = selectedCategoryFilter ? video.Catégorie === selectedCategoryFilter : true;

    const matchProject = selectedprojetfilter ? video.Nom_projet === selectedprojetfilter : true;

    const match_mes_videos = selected_mes_vides === 'Mes_videos' 
      ? video.id_User === userIdd 
      : true;

    const videoDate = new Date(video.Date_poste);
    const now = new Date();
    let matchTime = false;

    switch (selectedTimeFilter) {
      case 'All Videos':
        matchTime = true;
        break;
      case 'Nouveau':
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);
        matchTime = videoDate >= threeDaysAgo;
        break;
      case 'Cette semaine':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        matchTime = videoDate >= startOfWeek;
        break;
      case 'Ce mois-ci':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchTime = videoDate >= startOfMonth;
        break;
      case 'Cette année':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        matchTime = videoDate >= startOfYear;
        break;
      default:
        matchTime = true;
    }

    const matchesSearch = video.Nom_publication.toLowerCase().includes(recherche.toLowerCase());
    const isVideo = video.fileType === 'video';
    const matchType = selectedType ? video.Types === selectedType : true;

    return matchTime && match_mes_videos && matchCategory && matchesSearch && isVideo && matchType && matchProject;
  });

  setFilteredVideos(filtered);

  // Filtrage des documents
  const filteredDocuments = videos.filter((video) => {
    const matchCategory = selectedCategoryFilter ? video.Catégorie === selectedCategoryFilter : true;
    const matchProject = selectedprojetfilter ? video.Nom_projet === selectedprojetfilter : true;
    const matchTypeFile = selecteddocumentfilter ? video.fileType === selecteddocumentfilter : true;

    const match_mes_videos = selected_mes_vides === 'Mes_videos' 
      ? video.id_User === userIdd 
      : true;

    const matchesSearch = video.Nom_publication.toLowerCase().includes(recherche.toLowerCase());
    const matchType = selectedType ? video.Types === selectedType : true;

    return video.Catégorie === 'Document' && matchCategory && match_mes_videos && matchesSearch && matchType && matchProject && matchTypeFile;
  });
  setFilteredDocuments(filteredDocuments);
  //console.log(" bnabababa : ",filteredDocuments);
 

   
const filteredPlaylist = playlist.filter((pl) => {
  const match_mes_playlist = pl.id_User === userIdd;
  const matchesSearchPlaylist = pl.Nom_playlist.toLowerCase().includes(recherche.toLowerCase());


  return match_mes_playlist && matchesSearchPlaylist;
});

  setFilteredPlaylist(filteredPlaylist);

  setid_playlist(filteredPlaylist.map(playlist=>playlist.id));
  setplaylistUserid(filteredPlaylist.map(playlist=>playlist.id_User));
  setNomplaylist(filteredPlaylist.map(playlist=>playlist.Nom_playlist));

  
  
    fetch_user_data(filteredPlaylist.map(playlist => playlist.id_User));



 
  // Mettez à jour l'état des autres variables si nécessaire
  setVideoId(filtered.map(video => video.id));
  setVideoUserId(filtered.map(video => video.id_User));
  SetNom_video(filtered.map(video => video.Nom_publication));
  Setdate_poste(filtered.map(video => video.Date_poste));
  set_miniature_vid(filtered.map(video => video.miniature));
  set_type_vid(filtered.map(video => video.Types));
  set_n_pro_asso(filtered.map(video =>video.Nom_projet));
  set_id_projet_asso(filtered.map(video => video.id_projet));
  set_id_image_asso(filtered.map(video => video.image));
 //console.log(filtered.map(video => video.id_projet))

  fetch_user_data(filtered.map(video => video.id_User));





 // Mettre à jour les états pour les documents
 setDocumentId(filteredDocuments.map(video => video.id));
 setDocumentUserId(filteredDocuments.map(video => video.id_User));
 SetNom_document(filteredDocuments.map(video => video.Nom_publication));
 Setdate_poste_document(filteredDocuments.map(video => video.Date_poste));
 set_type_doc(filteredDocuments.map(video => video.Types));
 set_document_projet_asso(filteredDocuments.map(video => video.Nom_projet));
 fetch_user_data(filteredDocuments.map(video => video.id_User)); 
  

}, [selectedTimeFilter, selectedCategoryFilter, recherche,selectedType, selectedprojetfilter,selecteddocumentfilter,videos,playlist, currentPage]);
    



    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          if (allowedTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
            setFileName(selectedFile.name + ' |');
            setFileSize((selectedFile.size / 1024).toFixed(2) + ' KB' + ' < 5 Go');

            // Vérifiez si le fichier est une vidéo
            if (selectedFile.type.startsWith('video/')) {
              setIsVideo(true); 
          } else {
              setIsVideo(false); 
          }

          } else {
            alert('Type de fichier non autorisé.');
            setFile(null);
            setFileName('No file chosen');
            setFileSize('');
            setIsVideo(false); 
          }
        } else {
          setFile(null);
          setFileName('No file chosen');
          setFileSize('');
          setIsVideo(false);
        }
      };
    
      const handleFileChange2 = (e) => {
        const selectedFile2 = e.target.files[0];
        if (selectedFile2) {
          if (allowedTypes2.includes(selectedFile2.type)) {
            set_miniature(selectedFile2);
          } else {
            alert('Type de fichier non autorisé.');
            set_miniature(null);
          }
        } else {
          alert('Veuillez sélectionner votre fichier!');
        }
      };




// Fonction pour gérer la sélection
const handleSelect = (item) => {
  setSelected(item); 
};

const handleSelect2 = (item) => {
  if(selected2 == 'Playlist'){

    setCurrentPage(1);
  }else if(selected2 =='Video'){
    setCurrentPage(1)
  
  }

    setSelected2(item); 
    setCurrentPage(1);
  };

  const handleSelect3 = (item) => {
    setSelected3(item); 
  };

  const handleSelect4 = (item) => {
    setSelected4(item); 
    setCurrentPage(1);
  };

  const handleSelect5 = (item) => {
    setSelected5(item); 
  };

  const handleSelect6 = (item) => {
    setSelected6(item); 
  };


  

    /*DEBUT MODAL video */ 
    const handleAdd_video = () => {
        setIsModalOpen_video(true);
      };
      const handleClose_video = () => {
        setIsModalOpen_video(false);
      };
 

    /*DEBUT MODAL video */ 
    const handleAdd_video2 = () => {
      if(file){
        setIsModalOpen_video2(true);
      }else{
        set_err_file(' Veuillez en premier lieu choisir un fichier avant de passer au suivant !')
      }
       
      };
      const handleClose_video2 = () => {
        setIsModalOpen_video2(false);
      };


    /*DEBUT MODAL playlist */ 
    const handleAdd_playlist = () => {
        setIsModalOpen_playlist(true);
      };
      const handleClose_playlist = () => {
        setIsModalOpen_playlist(false);
      };


   /*DEBUT MODAL supprimer */ 
 const handlechoice_playlist = (userid,videoId) => {
  setIsModalOpen_choiceplaylist(true);
  setSelectedUserId(userid);
  setSelectedVideoId(videoId);
};
const handleClose_choiceplaylist = () => {
  setIsModalOpen_choiceplaylist(false);
  setSelectedUserId(null);
  setSelectedVideoId(null);
};


   /*DEBUT MODAL supprimer */ 
   const handleAdd_sup = (userid,videoId,videoname) => {
    setSelectedUserId(userid);
    setSelectedVideoId(videoId); 
    setselectedNom_video(videoname);
  };


  /*DEBUT MODAL supprimer */ 
  const handlesup_vid = (userid,videoId) => {
    setSelectedUserId(userid);
    setSelectedVideoId(videoId);
    setmodalsup_open(true);
  };
  const handleClose_supvid = () => {
    setSelectedUserId(null);
    setSelectedVideoId(null); 
    setmodalsup_open(false);
  };



 /*DEBUT MODAL supprimer */ 
 const handledelete_sup_play = (playlistid,Nom_playlist) => {
 // console.log('dans le handle_sup lid est ',playlistid);
  setSelectedPlaylistId(playlistid);
  setSelectedPlaylistNom(Nom_playlist);
  setIsModalOpen_sup_play(true);
};
const handleClose_sup_play = () => {
  setSelectedPlaylistId(null);
  setIsModalOpen_sup_play(false);
};


 /*DEBUT MODAL playlist */ 
 const handleAdd_projet = () => {
  setIsModalOpen_choisirprojet(true);
};
const handleClose_projet = () => {
  setIsModalOpen_choisirprojet(false);
};








const handleFileUpload = async () => {
  try {
    if (!file) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const isVideo = file.type.startsWith('video');
    if (selectedOption==='Public' && !miniature && isVideo) {
      alert('Veuillez sélectionner une miniature pour la vidéo.');
      return;
    }

    if (file.size > 2147483648) {
      alert('La taille du fichier dépasse la limite de 2 GO.');
      return;
    }

    if (Nom_publication.length > 65) {
      alert('Le nom de la vidéo doit contenir moins de 65 caractères.');
      return;
    }

    if (Description.length > 700) {
      alert('La Description de la vidéo doit contenir moins de 700 caractères.');
      return;
    }

    if(!selectedOption){
      alert('Veuillez selectioner le type de la video public ou privé .');
      return;
    }

    const Catégorie = isVideo ? 'Video' : 'Document'; 


    const formData = new FormData();
    formData.append("file", file);
    if (miniature) {
      formData.append("miniature", miniature);
    }
    formData.append("Nom_publication", Nom_publication);
    formData.append("Description", Description);
    formData.append("Catégorie", Catégorie);
    formData.append("selectedOption",selectedOption);
    formData.append("selectedProjectId",selectedProjectId);
    formData.append("username", username);
    formData.append("userprenom", userprenom);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token non trouvé.");
      return;
    }

    setIsUploading(true); // Démarre l'upload
    setUploadProgress(0); // Réinitialise la progression

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/upload_vid_play`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      }
    );

    setIsUploading(false); // Terminer l'upload
    setUploadProgress(0); // Réinitialise pour le prochain fichier

    

    //console.log("Fichier téléchargé avec succès:", response.data);
    Router.reload();
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
  }
};



const get_video = async () => {
  try {
    setLoadingVideos(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      Router.push('/Login2/Login2');
      return;
    }


     // Vérifiez le rôle de l'utilisateur et choisissez l'endpoint en conséquence
     const apiUrl = user_role === 'Administrateur'
     ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_vid`
     : `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_videos`;

     //console.log("URL de l'API:", apiUrl);
    const response = await axios.post(apiUrl,{},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const videos = response.data.Video || [];
      const updatedVideos = videos.map((video) => ({
        ...video,
        fileType: getFileType(video.Contenu_URL),
        isLoading: true,
      }));

      setVideos(updatedVideos);
      console.log("updatedVideos : ",updatedVideos);
      setFilteredVideos(updatedVideos);
    } else {
      console.log("Erreur lors de la récupération des vidéos");
    }
  } catch (err) {
    console.error("Erreur dans la récupération des vidéos:", err);
  } finally {
    setLoadingVideos(false);
  }
};


   
  
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase(); 
    switch (extension) {
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'video';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'document';
      case 'xls':
      case 'xlsx':
        return 'spreadsheet';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'unknown';
    }
  };
  
  
 



const get_playlist = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      Router.push('/Login2/Login2');
      return;
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_playlist`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.data.success) {
    
      const playlist = response.data.playlist || [];
      setplaylist(playlist);
      
      
      
      await fetch_user_data(playlist.map(playlist => playlist.id_User));
    } else {
      console.log('Erreur lors de la récupération des vidéos');
    }
  } catch (err) {
    console.log(err);
  }
};

  
  
const fetch_user_data = async (userIds) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("Token non trouvé");
    return;
  }

  const userRequests = userIds.map(async (userId) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_info`, { userId }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.user ? { id: userId, data: response.data.user } : null;
  });

  const users = await Promise.all(userRequests);
  const userData = users.filter(Boolean).reduce((acc, { id, data }) => {
    acc[id] = {
      id:data.id,
      nom: data.nom,
      prenom: data.prenom,
      photoprofil: data.photoprofil,
    };
    return acc;
  }, {});
  
  setUserInfo(prevState => ({ ...prevState, ...userData }));
};


const fetchAllProjets = async () => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error("Token non trouvé");
          Router.push('../Login2/Login2');
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
          
          setprojet_asso(projets);
          
         // console.log('Détails de tous les projets associé ont été récupérés avec succès');
      } else {
          console.error('Erreur lors de la récupération des détails des projets associé ');
      }
  } catch (err) {
      console.error('Erreur lors de la requête :', err);
  }
};

    
 


  const handledeletevid = async (id_vid,videoname) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      return;
    }
  
    try {
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_vid`,
        { id_vid,username,userprenom,videoname }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Utiliser le bon type de contenu
          },
        }
      );
    
      console.log("Vidéo supprimée avec succès:", response.data);
      Router.reload();
    } catch (err) {
      console.error("Erreur lors de la suppression de la vidéo:", err);
    }
  };


  const handledeleteplaylist = async (selectedPlaylistId,selectedPlaylistNom) => {
    console.log('Selected Playlist ID:', selectedPlaylistId); 
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_playlist`,
        { id_play: selectedPlaylistId, username:username, userprenom:userprenom, Nom_playlist:selectedPlaylistNom}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );
    
      console.log("playlist supprimée avec succès:", response.data);
      Router.reload();

    } catch (err) {
      console.error("Erreur lors de la suppression de la playlist:", err);
    }
  };

   

  const add_playlist =async()=>{
    try{

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            Router.push('../Login2/Login2');
            return;
        }

        if (!newplaylist || newplaylist.length > 50) {
          set_err_playlist('Le nom doit contenir moins de 50 caractères.');
          return;
      }
      


        axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_playlist`,{
          newplaylist : newplaylist,username:username,userprenom:userprenom,
          },{
            headers:{
                Authorization: `Bearer ${token}`,
            }
          }).then(()=> {
                
            console.log("données insérées avec succées !");})
            Router.reload();

    }catch(err){
        console.error('Erreur lors de l envoie du commentaire : ', err);
        set_err_playlist('Taille de la playlist plus élevé que 50 caractére');
    }
  }


  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState([]);
    const handleCheckboxChange = (e) => {
      const playlistId = parseInt(e.target.value, 10);
      if (e.target.checked) {
          setSelectedPlaylistIds([...selectedPlaylistIds, playlistId]);
      } else {
          setSelectedPlaylistIds(selectedPlaylistIds.filter(id => id !== playlistId));
      }
  };


  const add_vid_in_play =async()=>{
 try{

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            Router.push('../Login2/Login2');
            return;
        }


        axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_vid_in_play`,{
            id_Playlist : selectedPlaylistIds,
            videoId: selectedVideoId,
            username: username,
            userprenom : userprenom,
            selectedVideoName:selectedVideoName,
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
  
  

// Fonction de recherche pour filtrer vidéos et fichiers en fonction du terme de recherche
const handleSearch = (searchTerm) => {
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      video.Nom_publication.toLowerCase().includes(searchTerm.toLowerCase()) || 
      video.Nom_projet && video.Nom_projet.toLowerCase().includes(searchTerm.toLowerCase());
      
    const isValidFileType = video.fileType === 'video';
    return matchesSearch && isValidFileType;
  });
  setFilteredVideos(filteredVideos);

  const filteredFiles = videos.filter((file) => {
    const matchesSearch = file.Nom_publication.toLowerCase().includes(searchTerm.toLowerCase());
    const isValidFileType = ['image', 'pdf', 'document', 'spreadsheet'].includes(file.fileType);
    return matchesSearch && isValidFileType;
  });
  setFilteredDocuments(filteredFiles);

  // Réinitialiser la pagination
  setCurrentPage(1);
};


// Pagination pour les vidéos
const handleNextPage = () => {
  if (currentPage < Math.ceil(filteredVideos.length / videosPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};


// Pagination pour les playlist
const handleNextPage_play = () => {
  if (currentPage < Math.ceil(filteredPlaylist.length / PlaylistperPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage_play = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};


// Pagination pour les Document
const handleNextPage_Docu = () => {
  if (currentPage < Math.ceil(filteredDocuments.length / DocumetnPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage_Docu = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

  
    return(
        <>
        <div className={style.div_formation}>
      {/*------------------------------------------------------------------- */}

      <br/>

        <div className={style.div_top}>


            <div className={style.profile}>
            {isImageAvailable  ? (
    <Image
      className={style.profile_pic}
      src={imagePath}
      width={300}
      height={300}
      alt="Picture of the author"
      priority={true} // Pour améliorer le LCP
    />
  ) :    <p>Image non disponible</p>} <h1> Welcome To </h1>
                <h4>{username} {userprenom} </h4>
              
            </div>


            {/*--------------------------- */}
            <div className={style.recherche}>
            <input type='text' maxLength={50} className={style.input_recherche} placeholder='Rechercher quelque chose ...'  onChange={e => {
        setrecherche(e.target.value);
        handleSearch(e.target.value);
    }}/>
            </div>

            <div className={style.btn_ajouter}>
              {user_role && user_role ==='Chef de projet' && (
  <button className={style.btn_ajt } onClick={handleAdd_video}> <Image 
  className={style.logo}
  src='/video.webp' 
  width={50}       
  height={50}
  alt="Picture of the author"
  priority 
  />   Mettre En Ligne Une Video + </button>
              )}
             
              

                         {isModalOpen_video && (
                        <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_offre}>
                                    <h1> Upload La Publication</h1>
                                    <p> Si c'est une video pour de meilleurs résultats, les vidéos devraient être au moins <br/>en 720p {'(1920 x 1080 pixels)'} en format MP4.</p>

                                    <div className={style.fileUpload}>
                                    <input type="file" name="file" id="fileInput" className={style.modal_file_choice}   onChange={handleFileChange}/>
                                    <label htmlFor="fileInput" className={style.customFileLabel}>
                                    <span className={style.uploadButton}><Image 
                                                                         className={style.logo_modal}
                                                                         src='/upload.png' 
                                                                         width={100}       
                                                                         height={100}
                                                                         alt="Picture of the author"
                                                                        priority 
                                                                        />
                                  </span>
             <h5> Metter votre Publication ICI ↓ </h5><br/>
                                    <span className={style.fileName}>{fileName} {fileSize}</span>
    
                                      </label>
                                    </div>
                                    
                                    <h5 className={style.err_file}> {error_file} </h5>
                                    <br/>
                          <div className={style.flex_item_center}>
                          <button className={style.modal_close_btn_offre} onClick={handleClose_video}>Fermer</button>
                          <button className={style.modal_confirm_btn_offre} onClick={handleAdd_video2 } > Suivant </button>
                          
   
                            </div>
                                    </div>
                                    </div>
                         )}
                          {isModalOpen_video2 && (
                             <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_offre2}>
                                    <h2 className={style.titre_modal}> Entrer Ces informations concernant votre Contenu </h2>

                                    <div>
                                    <label className={style.label_info}> Nom De La Vidéo  <p>{'(65 lettres max)'}</p></label><br/>
                                    <input value={Nom_publication} type='text' maxLength={65} className={style.input_remplissage} placeholder='Entrer le nom de la video' onChange={(e)=> set_nom_publication(e.target.value)}/><br/>
                                        </div>
                                   
                                   <div>
                                   <label className={style.label_info}> Description <p>{'(700 lettres max)'}</p> </label><br/><br/><br/>
                                   <textarea  value={Description}  type='text' placeholder='Enter la description de votre video ici ' className={style.textarea_remplissage} maxLength={700} onChange={(e)=> set_Description(e.target.value)} /> <br/>
                                    </div>

                                    {selectedOption === 'Public' && (
                                      <>    <label className={style.label_info}> Miniature Pour La Video  <p>{'(Png / jpg / jpeg / web / jfif)'}</p></label><br/>
                                        <div className={style.custom_file}>
                                       
                                        <input type='file' name='miniature' id="miniature" className={style.input_remplissage_file} placeholder='Entrer la miniature de la video '  onChange={handleFileChange2} />
                                        <label for="miniature"> Choisir un fichier </label>
                                        </div>
                                      </>
                                
                                    )}

                                    {selectedOption ==='Privée' &&(
                                      <><br/><br/>
                                      </>
                                    )}
                                        <div className={style.select_priv_pub}>
                                           {/* Image par défaut */}
     
                                          <select  className={style.select_menu} value={selectedOption} onChange={handleSelectChange}>
                                            <option value="Public">Public</option>
                                            <option value="Privée">Privée</option>
                                          </select>
                                          {selectedOption === 'Public' && (
        <Image
          className={style.select_ph}
          src="/unhide.png"
          width={100}
          height={100}
          alt="Public"
          priority
        />
      )}
      {selectedOption === 'Privée' && (
        <Image
          className={style.select_ph2}
          src="/padlock.png"
          width={100}
          height={100}
          alt="Privée"
          priority
        />
      )}
                                        </div>
                                        {selectedOption === 'Privée' && (
                                          <div className={style.choisi_projet}>  <button onClick={handleAdd_projet}> Choisir Projet </button></div>
                                        
                                        )}





                                        
<br/>
{isUploading && (
  <div className={style.progressBarContainer}>
    <div
      className={style.progressBar}
      style={{ width: `${uploadProgress}%` }}
    ></div>
    <span>{uploadProgress}%</span>
  </div>
)}
                                    
                                    
                                    <br/>
                                    <div className={style.flex_item_center2}>
                                <button className={style.modal_close_btn_offre} onClick={handleClose_video2}>En arriére</button>
                                <button className={style.modal_confirm_btn_offre} onClick={handleFileUpload}  > Terminer </button> <br/>
                                </div>
                                </div>
                                </div>
                          )}

{isModalOpen_video2 && !isVideo && ( // Modal pour les autres types de publication
            <div className={style.modal_container_profile}>
                <div className={style.modal_container_rec_offre2}>
                    <h2>Entrer Ces informations concernant votre Contenu</h2>

                    <div>
                        <label className={style.label_info}>
                            Nom De La Publication <p>{'(65 lettres max)'}</p>
                        </label>
                        <br />
                        <input
                            value={Nom_publication}
                            type="text"
                            maxLength={65}
                            className={style.input_remplissage}
                            placeholder="Entrer le nom de la publication"
                            onChange={(e) => set_nom_publication(e.target.value)}
                        /><br/><br/><br/>
                         <div className={style.select_priv_pub}>
                                           {/* Image par défaut */}
     
                                          <select  className={style.select_menu} value={selectedOption} onChange={handleSelectChange}>
                                            <option value="Public">Public</option>
                                            <option value="Privée">Privée</option>
                                          </select>
                                         
                                          {selectedOption === 'Public' && (
        <Image
          className={style.select_ph}
          src="/unhide.png"
          width={100}
          height={100}
          alt="Public"
          priority
        />
      )}
      {selectedOption === 'Privée' && (
        <Image
          className={style.select_ph2}
          src="/padlock.png"
          width={100}
          height={100}
          alt="Privée"
          priority
        />
      )}
                                     {selectedOption === 'Privée' && (
                                          <div className={style.choisi_projet2}>  <button onClick={handleAdd_projet}> Choisir Projet </button></div>
                                        
                                        )}
      
                                        </div>
                        <br/>
                       

                    </div>

                    <div className={style.flex_item_center2}>
                        <button className={style.modal_close_btn_offre} onClick={handleClose_video2}>En arrière</button>
                        <button className={style.modal_confirm_btn_offre} onClick={handleFileUpload}>Terminer</button>
                    </div>
                </div>
            </div>
        )}


{isModalOpen_choisirprojet && (
                             <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_projet}>
                                    <h2> Choisi le projet dans lequel tu partage ta publication </h2>

                                    <table className={style.project_table}>
              <thead>
                <tr>
                  <th>Sélection</th>
                  <th>Nom du Projet</th>
                 
                </tr>
              </thead>
              <tbody>
                {projet_asso.length > 0 ? (
                  projet_asso.map((projet) => (
                    <tr key={projet.id_projet}>
                     
                      <td>{projet.Nom_projet}</td>
                      <td>
                        <input
                          type="radio"
                          name="selectedProject"
                          value={projet.id_projet}
                          checked={selectedProjectId === projet.id_projet}
                          onChange={() => setSelectedProjectId(projet.id_projet)}
                        />
                      </td>
                
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Aucun projet disponible.</td>
                  </tr>
                )}
              </tbody>
            </table>

                                    <br/>
                                    <div className={style.flex_item_center3}>
                                <button className={style.modal_close_btn_offre} onClick={handleClose_projet}>Fermer</button>
                                <button className={style.modal_confirm_btn_offre} onClick={handleClose_projet}  > Terminer </button>
                                </div>
                                </div>
                                </div>
                          )}




             
                <button  className={user_role !== 'Chef de projet' ? style.btn_ajt_blank : style.btn_ajt} onClick={handleAdd_playlist}>  <Image 
             className={style.logo}
             src='/playlist_.webp' 
             width={50}       
             height={50}
             alt="Picture of the author"
             priority 
             />  Ajouter Une Playlist +  </button>

            </div>

            {isModalOpen_playlist && (
                             <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_offre3}>
                                    <h2> Entrer Le nom de la Playlist </h2>

                                    <input placeholder='Entrer nom playlist'  onChange={e => {setnewplaylist(e.target.value)}} value={newplaylist} maxLength={50}/><br/>
                                     <h5 className={style.err_playlist}> {err_playlist}</h5>
                                    
                                    <div className={style.flex_item_center3}>
                                <button className={style.modal_close_btn_offre} onClick={handleClose_playlist}>En arriére</button>
                                <button className={style.modal_confirm_btn_offre}   onClick={add_playlist}> Terminer </button>
                                </div>
                                </div>
                                </div>
                          )}

             {/*--------------------------- */}
        

        </div>

        <div className={style.big_background}>
        <h2> New skills  </h2><br/>
        <p> Améliorez Vos Compétences <br/>Et Partagez Vos Ressources Avec Nos Formations En Ligne</p>
        <button> Commencer → </button>
      </div> 
      
      


      {/*------------------------------------------------------------------- */}

      <div className={style.div_down}>

        
      <div className={style.flexing_top}>
      <h2> Publications </h2>
        <div className={style.container}> 
            <button> Filtrer <Image
                className={style.sort}
                src="/sort.png"
                width={400}
                height={400}
                alt="Picture of the author"
                onClick={() => navigate('Profile')}
                priority
              />  </button> {/* Bouton déclencheur */}

            <div className={style.filtre}>
                
                <div>
                     <p>  Temps de poste   </p>
                <br/>
                <a onClick={() => handleSelect('All Videos') + handleTimeFilterSelect('All Videos')} className={selected === 'All Videos' ? style.selected : ''}> Toutes les videos </a>
                <a onClick={() => handleSelect('Nouveau') + handleTimeFilterSelect('Nouveau')} className={selected === 'Nouveau' ? style.selected : ''}> Nouveau </a>
                <a onClick={() => handleSelect('Semaine') + handleTimeFilterSelect('Cette semaine')} className={selected === 'Semaine' ? style.selected : ''}> Cette semaine </a>
                <a onClick={() => handleSelect('Mois') + handleTimeFilterSelect('Ce mois-ci')} className={selected === 'Mois' ? style.selected : ''}> Ce mois-ci </a>
                <a onClick={() => handleSelect('Année') + handleTimeFilterSelect('Cette année')} className={selected === 'Année' ? style.selected : ''}> Cette année </a>
                <br/>
                <p>  Type de Contenu   </p>
                <br/>
                <a onClick={() => handleSelect2('Video') + handleCategoryFilterSelect('Video')} className={selected2 === 'Video' ? style.selected : ''}> Video </a>
                <a onClick={() => handleSelect2('Document') + handleCategoryFilterSelect('Document')} className={selected2 === 'Document' ? style.selected : ''}> Document </a>
                <a onClick={() => handleSelect2('Playlist') + handleCategoryFilterSelect('Playlist')} className={selected2 === 'Playlist' ? style.selected : ''}> Playlist </a>
                </div>

                {user_role !=='Administrateur' &&(
             <div>
           
             <div>
                      {user_role==='Chef de projet' &&(
                  <>
                  <br/>
                  <p> Bibliothèque Globale   </p>
                <br/>
                <a onClick={() => handleSelect3('Mes_videos') + handlemesvideosFilterSelect('Mes_videos')} className={selected3 === 'Mes_videos' ? style.selected : ''}> Mes Publications </a>
                <a onClick={() => handleSelect3('All_videos') + handlemesvideosFilterSelect('All_videos')} className={selected3 === 'All_videos' ? style.selected : ''}> Tout les Publications </a>
                  </>
                )}

                <br/>
                <p> Type Publication </p>
                <br/>
                <a onClick={() => handleSelect4('Public') + handleTypevideosFilterSelect('Public')} className={selected4 === 'Public' ? style.selected : ''}> Public</a>
                <a onClick={() => handleSelect4('Privée') + handleTypevideosFilterSelect('Privée')} className={selected4 === 'Privée' ? style.selected : ''}> Privée </a>

                    </div>
             </div>
                
              )}
                
            </div>
        </div>

        <div>
          {selected4 === 'Privée' && (
            <>
            <div className={style.container2}>
            <button> Projet  <Image
                className={style.sort}
                src="/sort.png"
                width={400}
                height={400}
                alt="Picture of the author"
                onClick={() => navigate('Profile')}
                priority
              /> </button>
            <div className={style.filtre2}>
            <a 
            onClick={() => {
              handleSelect5('Tout les publications'); 
              handleCategoryProjetSelect('Tout les publications');
              setselectedprojetfilter(null); // Réinitialise le filtre
            }}
            className={selected5 === 'Tout les publications' ? style.selected : ''}
          >
            Tout les publications
          </a>
                 {projet_asso.length > 0 ? (
                  projet_asso.map((projet) => (
                    <div key={projet.id_projet}>
                      <a onClick={() => handleSelect5(projet.Nom_projet)+ handleCategoryProjetSelect(projet.Nom_projet)} className={selected5 === projet.Nom_projet ? style.selected : ''}>{projet.Nom_projet}
                      </a>

                      
                    </div>
                  ))
                ) : (
                  <p>
                    <p colSpan="4">Aucun projet disponible.</p>
                  </p>
                )}
             
           
              

            </div>
            </div>
            </>
          )}
           </div>



           <div>
           {selected2 ==='Document' &&(
              <>
                <div className={style.container2}>
            <button> Type de Document <Image
                className={style.sort2}
                src="/sort.png"
                width={400}
                height={400}
                alt="Picture of the author"
                onClick={() => navigate('Profile')}
                priority
              /> </button>
            <div className={style.filtre2}>
         
                <a onClick={() => handleSelect6('') + handleCategoryDocumentSelect('')} className={selected6 === '' ? style.selected : ''}> All </a>
                <a onClick={() => handleSelect6('image') + handleCategoryDocumentSelect('image')} className={selected6 === 'image' ? style.selected : ''}> Image</a>
                <a onClick={() => handleSelect6('pdf') + handleCategoryDocumentSelect('pdf')} className={selected6 === 'pdf' ? style.selected : ''}> Pdf </a>
                <a onClick={() => handleSelect6('document') + handleCategoryDocumentSelect('document')} className={selected6 === 'document' ? style.selected : ''}> Word </a>
                <a onClick={() => handleSelect6('spreadsheet') + handleCategoryDocumentSelect('spreadsheet')} className={selected6 === "spreadsheet" ? style.selected : ''}> Excel </a>
            </div>
            </div>
              </>
           )}
           </div>

       
      </div> 
 <p className={style.p_texte_down}> Toutes Les Publications </p>
      <div className={style.div_contenus_bas}>
  {paginatedVideoId.map((id, index) => {
     const video = videos[startIndex + index];
     const fileType = getFileType(video.Contenu_URL);  

     const id_projet = id_projet_asso[startIndex + index];
     const image_assos = image_asso[startIndex + index];

    const userId = videoUserId[startIndex + index]; // Récupérer l'ID de l'utilisateur associé
    const user = userInfo[userId] || {}; // Récupérer les infos de l'utilisateur ou un objet vide

   // Extraction du nom de la miniature et nettoyage
const miniature = miniature_vid[startIndex + index];
const imageName = miniature ? miniature.split(/[/\\]/).pop() : ''; // Vérifiez si miniature est défini
const cleanedImageName = imageName ? imageName.replace(/^(public\/)?(files\/)?/, '') : ''; // Nettoyage si imageName existe

const imagePath = imageName
  ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`
  : '';
  

    // Chemin de l'image associée au projet
    const projectImagePath = image_asso
    ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${image_assos}`
    : '';


    // Traitement pour la photo de profil
    const userProfileImage = user.photoprofil || ''; // Obtenez le chemin de la photo de profil
    const profileImageName = userProfileImage.split(/[/\\]/).pop();
    const cleanedProfileImageName = profileImageName.replace(/^(public\/)?(files\/)?/, '');
    const profileImagePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedProfileImageName}`;
   

 
    const handleVideoClick = (id, userid,fileType,Nom_video,imagePath) => {
    
        setSelectedVideoId(id);
        setSelectedUserId(userid);
        setselectedNom_video(Nom_video);
         // Appel de navigate avec les paramètres
      navigate('Video', {
        id: id,
        nom: user.nom,
        prenom: user.prenom,
        photoprofil: profileImagePath,
        userIdd: userIdd,
        userId:userid,
        imagePatth:imagePath,
        type: 'Video',
      }); 
    };
    
    const handleImageLoad = (index) => {
     
      setVideos((prevVideos) => {
        const updatedVideos = [...prevVideos];
        updatedVideos[index].isLoading = true; // Met à jour isLoading pour la vidéo concernée
        return updatedVideos;
      });
    };
     

  return (
    <div key={id} className={style.Contenu}>
   
        {loadingVideos ? (
          <div className={style.loader} > <p>Chargement ... </p></div> 
        ) : (
          <>
          {Type_vid[startIndex + index] === 'Privée' && id_projet ? (
            <Image
              className={style.miniature}
              src={projectImagePath}
              width={290}
              height={120}
              alt="Miniature associée au projet"
              priority={true}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <>
              {imagePath && cleanedImageName ? (
                <Image
                  className={style.miniature}
                  src={imagePath}
                  width={290}
                  height={120}
                  alt="Miniature de la vidéo"
                  priority={true}
                  onLoad={() => handleImageLoad(index)}
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <p>Image non disponible (filetype: {fileType})</p>
              )}
            </>
          )}
        </>
      )}
  
  
      <div className={style.titre_contenu}>
        {profileImagePath ? (
          <Image
            className={style.php_contenu}
            src={profileImagePath || '/default-profile.jpg'}
            width={250}
            height={180}
            alt="Picture of the author"
            priority={true} // Pour améliorer le LCP
          />
        ) : (
          <p>Image non disponible</p>
        )}
  
        <div className={style.a_video_div}>
          <a onClick={() => handleVideoClick(id, user.id, fileType,Nom_video,imagePath)} style={{ cursor: 'pointer' }}>
            {Nom_video[startIndex + index]}
          </a>
        </div>
  
        <div className={style.info_vid}>
          <p>{user.nom ? `${user.nom} ${user.prenom} ` : 'Utilisateur inconnu'}
          {Type_vid[startIndex+ index] === 'Privée' ? (<>
          {'( '}{n_pro_asso[startIndex + index]}{' )'}
          </>
          ):('')}
             </p>
          {Type_vid[startIndex+ index] === 'Privée' ? (
  <p className={style.nom_proj_asso}>‎</p>
) : (
  <p>{Date_poste[startIndex + index]?.slice(0, 10)}</p>
)}

          
         
        </div>
      </div>
  
      <div className={style.container_params} onMouseEnter={() => setSelectedUserId(userId) + setselectedNom_video(Nom_video[startIndex+index])} onMouseLeave={() => setSelectedUserId(null) +setselectedNom_video(null)}>
        <button onClick={() => handleAdd_sup(userId, id,Nom_video[startIndex+index])} style={{ cursor: 'pointer' }} className={style.delete_video_modal}>
          ⋮
        </button>
  
        <div className={style.filtre_params} onMouseEnter={() => setSelectedUserId(userId)} onMouseLeave={() => setSelectedUserId(null)}>
          {userIdd === selectedUserId && (
            <>
              <a onClick={() => handlesup_vid(userId, id)} style={{ cursor: 'pointer' }}>
                Supprimer
              </a>
            </>
          )}
          <a onClick={() => handlechoice_playlist(userId, id)} style={{ cursor: 'pointer' }}>
            Ajouter à une playlist
          </a>
        </div>
      </div>
    </div>
  );
  
  })}


  

{ismodalsup_open &&(
               <div className={style.modal_container_profile}>
            <div className={style.modal_container_rec_sup2}>
            <h1>  Etes-Vous Sûr De Supprimer la video ? </h1><br/>
            <div className={style.bouge_button}>
            <button onClick={(() => handledeletevid(selectedVideoId,selectedVideoName))} style={{ cursor: 'pointer' }} >Accepter</button>
            <button className={style.modal_close_btn_offre} onClick={handleClose_supvid}>Annuler</button>
              </div>

              </div>
              </div>
            )}

{isModalOpen_choiceplaylist && (
    <div className={style.modal_container_profile}>
        <div className={style.modal_container_rec_playlist}>
            <h1>Choisir playlist :</h1>
            <div className={style.table_playlists_div}>
            <table className={style.table_playlists}>
                <tbody>
                    {playlist
                    .filter(playlistItem => playlistItem.id_User === userIdd)
                    .map((playlistItem, index) => (
                        <tr key={playlistItem.id}>
                            <td>
                            
                               <input 
    type="checkbox" 
    id={`playlist-${index}`} 
    value={playlistItem.id} 
    name="playlist"
    onChange={handleCheckboxChange}
/>


                            </td>
                            <td>
                            <label htmlFor={`playlist-${index}`}>{Nom_playlist[index]}</label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <button onClick={()=>add_vid_in_play(selectedPlaylistIds,selectedVideoId)}> Ajouter </button>
            <button className={style.modal_close_btn_offre} onClick={handleClose_choiceplaylist}>Annuler</button>
        </div>
    </div>
)}

{selectedCategoryFilter === 'Playlist' && (
  <>
    {paginatedPlaylistId.length === 0 ? (
      <p className={style.no_contenu_message}>Aucune playlist Pour l'instant</p>
    ) : (
      paginatedPlaylistId.map((id, index) => {
        const userId = playlistUserId[startIndex + index]; 
        const user = userInfo[userId] || {}; 

        // Traitement pour la photo de profil
        const userProfileImage = user.photoprofil || ''; 
        const profileImageName = userProfileImage.split(/[/\\]/).pop();
        const cleanedProfileImageName = profileImageName.replace(/^(public\/)?(files\/)?/, '');
        const profileImagePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedProfileImageName}`;

        const handlePlaylistClick = () => {
          navigate('Playlist', {
            id: id,
            nom: user.nom,
            prenom: user.prenom,
            photoprofil: profileImagePath,
            userIdd: userIdd,
            id_Playlist: paginatedPlaylistId[index],
            Nom_playlist: Nom_playlist[index],
            type: 'playlist',
          });
        };

        return (
          <div key={id} className={style.Contenu}>
            <Image 
              className={style.miniature}
              src='/nature.jpg'
              width={300}       
              height={200}
              alt="Miniature de la vidéo"
              priority 
              onContextMenu={(e) => e.preventDefault()} 
            />

            <div className={style.titre_contenu}>
              {profileImagePath ? (
                <Image 
                  className={style.php_contenu}
                  src={profileImagePath || '/default-profile.jpg'} 
                  width={300}       
                  height={180}
                  alt="Picture of the author"
                  priority 
                />
              ) : (
                <p>Image non disponible</p>
              )}

              <div className={style.a_video_div}>
                <a style={{ cursor: 'pointer' }} onClick={handlePlaylistClick}>
                  {Nom_playlist[startIndex + index]}
                </a>
              </div>

              <div className={style.info_vid}>
                <p>Posté par : {user.nom ? `${user.nom} ${user.prenom}` : 'Utilisateur inconnu'}</p>
              </div>
            </div>

            <a
              onClick={() => handledelete_sup_play(paginatedPlaylistId[index],Nom_playlist[startIndex+index])}
              style={{ cursor: 'pointer' }}
              className={style.delete_playlist_modal}
            >
              ⋮
            </a>
          </div>
        );
      })
    )}
  </>
)}

{isModalOpen_sup_play && (
    <div className={style.modal_container_profile}>
        <div   className={style.modal_container_rec_sup}>
     
          <div>
          <h1> Vous Etes Sur De Supprimer Cette Playlist ? </h1>
          <button onClick={(() => handledeleteplaylist(selectedPlaylistId,selectedPlaylistNom))} > Exécuter </button>
          <button className={style.modal_close_btn_offre} onClick={handleClose_sup_play}>Annuler</button>
          
            </div>
          
         
          </div>
          </div>)}










          {selectedCategoryFilter === 'Document' && (
  <>
  
    {paginatedDocumentId.map((id, index) => {
  const Document = filteredDocuments[startIndex + index];
        // Vérifie que Document existe avant de tenter d'accéder à ses propriétés
  if (!Document) {
    return null; 
  }

      const userId = DocumentUserId[startIndex + index]; 
      const user = userInfo[userId] || {}; 
      const fileType = getFileType(Document.Contenu_URL); 
      // Filtrer pour n'afficher que les documents (pas les vidéos)
      if (fileType !== 'video') {
        // Chemins des icônes pour les fichiers spécifiques
        const fileIcons = {
          pdf: '/pdf.png',
          document: '/word2.png',
          spreadsheet: '/excel2.png',
          image: '/image.png',
        };

        // Sélectionner une icône en fonction du type de fichier
        const fileIcon = fileIcons[fileType] || '/background2.jpg'; // Sinon, afficher l'icône du fichier par défaut

       
        const userProfileImage = user.photoprofil || ''; 
        const profileImageName = userProfileImage.split(/[/\\]/).pop();
        const cleanedProfileImageName = profileImageName.replace(/^(public\/)?(files\/)?/, '');
        const profileImagePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedProfileImageName}`;

        //console.log('filtered documents : ', filteredDocuments);

     
        const Contenu_URL = Document.Contenu_URL.split(/[/\\]/).pop();
        const cleanedContenu_URL = Contenu_URL.replace(/^(public\/)?(files\/)?/, '');

        const handleDocumentClick = (id, userId, fileType) => {
          const fileUrl = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedContenu_URL}`;
          window.location.href = fileUrl; 
        };

        return (
          <div key={id} className={style.Contenu}>
            <Image 
              className={style.miniature_file}
              src={fileIcon}
              width={180}       
              height={120}
              alt="Miniature du document"
              priority 
              onContextMenu={(e) => e.preventDefault()} 
            />
            <div className={style.titre_contenu}>
              {profileImagePath ? (
                <Image 
                  className={style.php_contenu}
                  src={profileImagePath || '/default-profile.jpg'} 
                  width={180}       
                  height={120}
                  alt="Picture of the author"
                  priority 
                />
              ) : (
                <p>Image non disponible</p>
              )}
              <div className={style.a_video_div}>
                <a style={{ cursor: 'pointer' }} onClick={() => handleDocumentClick(id, user.id, fileType)}>
                {Nomdocument[startIndex + index]}
                </a>
              </div>

              <div className={style.info_vid}>
                <p> {user.nom ? `${user.nom} ${user.prenom}` : 'Utilisateur inconnu'} {type_doc[startIndex + index] === 'Privée' ? (<>
          {'( '}{document_projet_asso[startIndex + index]}{' )'}
          </>
          ):('')}</p>
  
                  
                <p>{date_poste_document[startIndex + index]?.slice(0, 10)}</p>
              </div>
            </div>
            <div className={style.container_params} onMouseEnter={() => setSelectedUserId(userId)+setselectedNom_video(Nomdocument[startIndex+index])}   onMouseLeave={() => setSelectedUserId(null)+setselectedNom_video(null)} >
          <button onClick={()=>handleAdd_sup(userId,id,Nomdocument[startIndex+index])} style={{ cursor: 'pointer' }} className={style.delete_video_modal}>⋮</button>
         
         
          <div className={style.filtre_params}   onMouseEnter={() => setSelectedUserId(userId)}   onMouseLeave={() => setSelectedUserId(null)} >
          {userIdd === selectedUserId && (
            <>
                        <a onClick={()=>handlesup_vid(userId,id)} style={{ cursor: 'pointer' }} > Supprimer </a>
            </>
          )}
          {ismodalsup_open &&(
               <div className={style.modal_container_profile}>
            <div className={style.modal_container_rec_sup2}>
            <h1>  Etes-Vous Sûr De Supprimer le Document ? </h1><br/>
            <div className={style.bouge_button}>
            <button onClick={(() => handledeletevid(selectedVideoId,selectedVideoName))} style={{ cursor: 'pointer' }} >Accepter</button>
            <button className={style.modal_close_btn_offre} onClick={handleClose_supvid}>Annuler</button>
              </div>

              </div>
              </div>
            )}
            
            </div>
            </div>
          </div>
        );
      }
      
      return null;
    })}
  </>
)}









</div>

{selected2 ==='Video' &&(
  <div className={style.pagination_div}>
  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
    Précédent
  </button>
  <span>{`Page ${currentPage} sur ${totalPages}`}</span>
  <button onClick={handleNextPage} disabled={currentPage === totalPages}>
    Suivant
  </button>
</div>
)}

{selected2 ==='Playlist' &&(
  <div className={style.pagination_div}>
  <button onClick={handlePreviousPage_play} disabled={currentPage === 1}>
    Précédent
  </button>
  <span>{`Page ${currentPage} sur ${totalPages_playlist}`}</span>
  <button onClick={handleNextPage_play} disabled={currentPage === totalPages_playlist}>
    Suivant
  </button>
</div>
)}
{selected2 ==='Document' &&(
  <div className={style.pagination_div}>
  <button onClick={handlePreviousPage_Docu} disabled={currentPage === 1}>
    Précédent
  </button>
  <span>{`Page ${currentPage} sur ${totalPages_doc}`}</span>
  <button onClick={handleNextPage_Docu} disabled={currentPage === totalPages_doc}>
    Suivant
  </button>
</div>
)}



  



       

      </div>


        </div>
      
        </>
    )
}