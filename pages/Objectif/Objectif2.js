import style from '../../styles/Objectif.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function Objectif2({username,userprenom,user_role,userId}) {
    const router = useRouter(); // Utilisation correcte de useRouter
    const { id, nom, Description, userIdd } = router.query; // Récupération des paramètres de l'URL
    const [modal_add_objectif,set_modal_add_objectif]=useState('');

    const [add_Titre_objectif,set_add_Titre_objectif]=useState('');
    const [add_nom_objectif,set_add_nom_objectif]=useState('');
    const [add_Description_objectif,set_add_Description_objectif]=useState('');
    const [file,set_add_File_objectif]=useState('');
   const  [message,setMessage]=useState('');


   const [Objectifs,setObjectifs]=useState([]);
   const [allobjectifs,setallobjectifs]=useState([]);
   const [searchQuery, setSearchQuery] = useState('');

    const [edit_finishing_objectif,set_edit_finishing_objectif]=useState('');
    
    /*DEBUT MODAL modal */ 
const handleAdd_objectif = () => { set_modal_add_objectif(true); };
const handleClose_objectif = () => {  set_modal_add_objectif(false);};
/*FIN*/ 


const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jfif', 
    'image/avif', 
    'image/webp',
    'application/msword',       // Word (.doc, .docx)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
    'text/plain',                // Texte (.txt)
    'application/pdf',          // PDF (.pdf)
    'application/vnd.ms-excel', // Excel (.xls)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Excel (.xlsx)
  ];
  

  useEffect(() => {
    if (userIdd) {
        fetch_all_objectifs();
      
    }
}, [userIdd]);

const [fileName, setFileName] = useState('No file chosen');
const [fileSize, setFileSize] = useState('');
const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        set_add_File_objectif(selectedFile);
        setFileName(selectedFile.name + ' |');
        setFileSize((selectedFile.size / 1024).toFixed(2) + ' KB' + ' < 2 Go');

      } else {
        alert('Type de fichier non autorisé.');
        set_add_File_objectif(null);

      }
    } else {
      setFile(null);
    }
  };



    // Fonction pour ajouter un projet
const handleAddNewObjectif = async () => {
    if (!add_Titre_objectif || add_Titre_objectif.length > 20) {
        setMessage('Le titre de l objectif doit être saisi ( doit pas dépasser 20 caractères )');
        return;
    }

    if (!add_nom_objectif || add_nom_objectif.length > 35) {
        setMessage('Le nom de l objectif doit être saisi ( doit pas dépasser 35 caractères )');
        return;
    }

    if (!add_Description_objectif || add_Description_objectif.length > 250) {
        setMessage('La description de l objectif doit être saisi ( ne doit pas dépasser 250 caractères )');
        return;
    }


    if(file){
        if (file.size > 10485760) {
        alert('File size exceeds the limit of 10 MB.');
        return;
      }
    }else{
        set_add_File_objectif(null);
    }
    
      

      const formData = new FormData();
      formData.append("file", file);
      formData.append('add_Titre_objectif', add_Titre_objectif);
      formData.append('add_nom_objectif', add_nom_objectif);
      formData.append('add_Description_objectif', add_Description_objectif);
      formData.append('id',id);
      formData.append('username',username);
      formData.append('userprenom',userprenom);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            router.push('../Login/Login');
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/add_objectif`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log('objectif added successfully:', response.data);
        router.reload();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du projet :', err);
        setMessage('Erreur lors de l\'ajout du projet');
    }
};

const handleDeleteObjectif = async (id_objectif) => {
  if (!id_objectif) {
      setMessage('ID de l\'objectif requis pour la suppression.');
      return;
  }

  try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error("Token non trouvé");
          router.push('../Login/Login');
          return;
      }

      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_objectif`,{  id_objectif,
                  username,    
                  userprenom,  },
          {
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
            
          }
      );

      if (response.data.success) {
          console.log('Objectif supprimé avec succès:', response.data);
          setMessage('Objectif supprimé avec succès.');
          router.reload(); // Recharge la page pour actualiser les données
      } else {
          console.error('Échec de la suppression de l\'objectif :', response.data.message);
          setMessage('Échec de la suppression de l\'objectif.');
      }
  } catch (err) {
      console.error('Erreur lors de la suppression de l\'objectif :', err);
      setMessage('Erreur lors de la suppression de l\'objectif.');
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
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/get_all_objectifs`,
            { id },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            const objectifs = response.data.objectifs;
           // console.log('tout objectifs ici  :',objectifs)
            setObjectifs(objectifs);
            setallobjectifs(objectifs);
            console.log('Détails de tous les objectifs récupérés avec succès');
        } else {
            console.error('Erreur lors de la récupération des détails des objectifs');
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
};




const handlechangeetat = async (id,etat) => {
    try {

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      console.log(etat);


      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/change_etat`,{ username:username,userprenom:userprenom,id:id,etat},
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


  const [currentPage, setCurrentPage] = useState(1);
  const objectif_per_page = 16;
  const indexOfLastprojet2 = currentPage * objectif_per_page;
const indexOfFirstprojet2 = indexOfLastprojet2 - objectif_per_page;

const current_objectifs = Objectifs.slice(indexOfFirstprojet2, indexOfLastprojet2);
const totalPages_projet2 = Math.ceil(Objectifs.length / objectif_per_page);


const handlePageChange2 = (page) => {
setCurrentPage(page);
};



const handleSearch = (event) => {
  const query = event.target.value.toLowerCase();
  setSearchQuery(query);

  if (query === '') {
      // Restaurer tous les projets si la barre de recherche est vide
      setObjectifs(Objectifs);
  } else {
      // Filtrer les projets en fonction de la recherche
      const filteredObj = allobjectifs.filter(obj => 
        obj.Titre.toLowerCase().includes(query) || 
        obj.Nom_objectif.toLowerCase().includes(query) ||
        obj.Description.toLowerCase().includes(query)
      );

      setObjectifs(filteredObj);
  }
};


    return (
        <>
           <div className={style.div_all_objectif}>

           {user_role === 'Chef de projet' && (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User)) && (
    <div className={style.btn_ajt_obj}>
        <button style={{ cursor: 'pointer' }} onClick={handleAdd_objectif}> + </button>
    </div>
)}

            <div className={style.header}>
            <input type='text' 
            className={style.input_recherche} 
            placeholder='Chercher ce que vous voulez...'
            onChange={handleSearch}
            />


            </div>
    
         
          
            {modal_add_objectif &&(
                        <>
                        
                        <div className={style.modal_container_profile}>
                        <div className={style.modal_container_rec_offre}>
                            <h2> Ajouter un Objectif </h2><br/>

                            <div>
                            <label>Titre <strong>* </strong></label><br/>
                            <input type='text' maxLength={20} placeholder='Ajouter un Titre à l objectif ' onChange={(e)=> set_add_Titre_objectif(e.target.value)}/><br/><br/>
                            </div>

                            <div>
                            <label>Nom de l'objectif <strong>* </strong> </label><br/>
                            <input type='text' maxLength={35} placeholder='Ajouter un nom à l objectif' onChange={(e)=> set_add_nom_objectif(e.target.value)}/><br/><br/>
                            </div>

                          <div>
                          <label>Description de l'Objectif <strong>* </strong> </label><br/>
                            <textarea type='text' maxLength={250} placeholder='Ajouter une description à l objectif' onChange={(e)=> set_add_Description_objectif(e.target.value)}/><br/><br/>

                          </div>
                            <label>"Fichier <i className={style.italic}> (optionnel) : pour des consignes ou un contexte spécifique."</i></label><br/>
                            
                            <div className={style.fileUpload}>
                                    <input type="file" name="file" id="fileInput" className={style.modal_file_choice}   onChange={handleFileChange}/>
                                    <label htmlFor="fileInput" className={style.customFileLabel}>
                                    <span className={style.uploadButton}>
                                  </span>
             <h5> Metter votre Publication ICI ↓ </h5><br/>
                                    <span className={style.fileName}>{fileName} {fileSize}</span>
    
                                      </label>
                                    </div><br/><br/><br/><br/><br/> <p className={style.err_message}>{message}</p>
                            
                           
                            <button  style={{ cursor: 'pointer' }} onClick={handleClose_objectif}> Fermer</button>
                            <button   style={{ cursor: 'pointer' }} onClick={handleAddNewObjectif}> Terminer</button>
                            </div>
                        </div>
                        </>
                    )}

<div className={style.div_bas2}>
  {current_objectifs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((projet, index) => {
    return (
      <div key={index} className={style.objectif_asso}>
    {projet.Terminer === false ? (
  <Image
    className={style.pin}
    src="/pin.png"
    width={350}
    height={350}
    alt="Picture of the author"
    priority
    style={{
      cursor:
        user_role === 'Chef de projet' &&
        (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
          ? 'pointer'
          : 'not-allowed',
      pointerEvents:
        user_role === 'Chef de projet' &&
        (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
          ? 'auto'
          : 'none',
    }}
    onClick={
      user_role === 'Chef de projet' &&
      (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
        ? () => handlechangeetat(projet.id, true)
        : undefined
    }
  />
) : (
  <Image
    className={style.pin}
    src="/pin_yes.png"
    width={350}
    height={350}
    alt="Picture of the author"
    priority
    style={{
      cursor:
        user_role === 'Chef de projet' &&
        (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
          ? 'pointer'
          : 'not-allowed',
      pointerEvents:
        user_role === 'Chef de projet' &&
        (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
          ? 'auto'
          : 'none',
    }}
    onClick={
      user_role === 'Chef de projet' &&
      (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User))
        ? () => handlechangeetat(projet.id, false)
        : undefined
    }
  />
)}


        <tr>
          <td>
            <p>{index + 1}. {projet.Titre}</p>
          </td>
          <br />
          <td> Objectif : {projet.Nom_objectif} </td>
          <br />
          <td>
            <p>{projet.Description}</p>
          </td>
          <br/>
          
          <td>
          {projet.Fichier && (
            
              <a href={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${projet.Fichier}`} download>
                Download
              </a>
           
          )}‎  </td><br/>

{user_role === 'Chef de projet' && (Objectifs.length === 0 || (Objectifs.length > 0 && userId === Objectifs[0]?.id_User)) && (<td> 
            <button style={{ cursor: 'pointer' }} onClick={()=>handleDeleteObjectif(projet.id)}>   <Image
            className={style.trash}
            src="/trash.png"
            width={350}
            height={350}
            alt="Trash icon"
            priority
        /></button></td>
          )}
          <br />
        </tr>
      </div>
    );
  })}
</div>
<div className={style.pagination}>
    <button onClick={() => handlePageChange2(currentPage - 1)} disabled={currentPage === 1}>
        Précédent
    </button>
    <span>{`Page ${currentPage} sur ${totalPages_projet2}`}</span>
    <button onClick={() => handlePageChange2(currentPage + 1)} disabled={currentPage === totalPages_projet2}>
        Suivant
    </button>
</div>





           </div>
        </>
    );
}
