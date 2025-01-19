import style from '../../styles/profile.module.css';
import Image from 'next/image';
import { useEffect ,useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function profile({username, userprenom,usersecteur,user_image,usertelephone,userdate,userfile_id,userfile_path,userfile_size,userfile_type,user_Gmail}){
    const [isModalOpen_offre, setIsModalOpen_offre] = useState(false);
    const [isModalOpen_parametre, setIsModalOpen_parametre] = useState(false);
    const Router = useRouter();
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [recherche, setrecherche]=useState('');
    const [newtelephone, setnewtelephone]=useState('');
    const [newGmail, setnewGmail]=useState('');
    const [showModal, setShowModal] = useState(false); // État pour gérer le modal
    const [modalMessage, setModalMessage] = useState('');
    const [error,seterror]=useState('');
    const [new_photo_profil, set_new_photot_profil]=useState(null);
    const [files, setFiles] = useState(userfile_path || []);
    const [fileIds, setFileIds] = useState(userfile_id || []);
    const [error_file,seterror_file]=useState('');
    
    
const imageName = user_image.split(/[/\\]/).pop(); 
const cleanedImageName = imageName.replace(/^(public\/)?(files\/)?/, ''); 
const imagePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;



      /*DEBUT MODAL offre */ 
      const handleAdd_offre = () => {
        setIsModalOpen_offre(true);
      };
      const handleClose_offre = () => {
        setIsModalOpen_offre(false);
      };
 
  
    /*DEBUT MODAL parametre */ 
    const handleAdd_parametre = () => {
      setIsModalOpen_parametre(true);
    };
    const handleClose_parametre = () => {
      setIsModalOpen_parametre(false);
    };



  const [fileName, setFileName] = useState('No file chosen ( Taille max du fichier 1Go ) ');
  const [fileSize, setFileSize] = useState('');
  const [file, setFile] = useState(null); 

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','txt','text/plain'];

const handleProfilePicChange = (event) => {
  set_new_photot_profil(event.target.files[0]);
  
}


const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name + ' |'); 
      setFileSize((selectedFile.size / 1024).toFixed(2) + ' KB' + ' < 10 MB'); 
    } else {
      alert('Type de fichier non autorisé.');
      setFile(null);
      setFileName('No file chosen');
      setFileSize('');
    }
  } else {
    setFile(null);
    setFileName('No file chosen');
    setFileSize('');
  }
};


    const [selected, setSelected] = useState('All_files'); // État pour suivre l'élément sélectionné

    // Fonction pour gérer la sélection
    const handleSelect = (item) => {
      setSelected(item); 
    };



      // Fonction pour convertir la taille en KB ou MB
      const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes < 1024) {
            return sizeInBytes + ' B'; // Octets
        } else if (sizeInBytes < 1048576) {
            return (sizeInBytes / 1024).toFixed(2) + ' KB'; 
        } else {
            return (sizeInBytes / 1048576).toFixed(2) + ' MB'; 
        }
    };








    useEffect(() => {
      if (username && userprenom && usersecteur) {
        setLoading(false); 
      } else {
        const fetchUserData = async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/user_files`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
             
              setLoading(false);
            } catch (error) {
              console.error("Error fetching user data:", error);
              Router.push('/Login/Login');
              setLoading(true);
            }
          }
        };
  
        fetchUserData();
      }
    }, [username, userprenom, usersecteur]);

    if (loading) {
    return <div>Loading...</div>; 
  }
  const handleFileUpload = async () => {
    try {

      if (!file) {
        alert('Please select a file before uploading.');
        return;
      }
    
      if (file.size > 10485760) {
        alert('File size exceeds the limit of 10 MB.');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      formData.append("userprenom", userprenom);
    
      console.log("1",file);
  
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
  
    
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/upload_file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          
        }
        
      );
    
      console.log("File uploaded successfully:", response.data);
      Router.reload();
   
    } catch (error) {
      seterror_file('Type de fichier non compatible ou taille de fichier trop élevé !')
      console.error("Error uploading file:", error);
      
    }
  };

   // Fonction pour filtrer les fichiers
   const filteredFiles = files.filter((filePath, index) => {
    const fileType = userfile_type[index];
    const fileName = filePath.split('/').pop();
    const extension = fileName.split('.').pop();

    const matchesSearch = fileName.toLowerCase().includes(recherche.toLowerCase());

    if (selected === 'All_files') {
        return matchesSearch;
    } else if (selected === 'Documents') {
        return matchesSearch && ['doc', 'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(extension.toLowerCase());
    } else if (selected === 'PDFs') {
        return matchesSearch && fileType === 'application/pdf';
    } else if (selected === 'excel') {
        return matchesSearch && (extension === 'application/vnd.ms-excel' || extension === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            fileType === 'application/vnd.ms-excel' ||
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } else if (selected === 'Images') {
        return matchesSearch && ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase());
    }

    return false;
});






  const handle_delete_file=async(fileId,fileName)=>{
    try{
      const token = localStorage.getItem('token');
          if (!token) {
              console.error('Token not found');
              return;
          }
          

          const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/delete_file`,
          {
            // Passez encadreurId et apprentiId dans les données à envoyer
            userfile_id:fileId , username:username,userprenom:userprenom,fileName:fileName      
          },{
            headers: {
              'Authorization': `Bearer ${token}`,
          }, });
          if (response.status === 200){
               // Met à jour l'état pour supprimer le fichier localement
               setFiles((prevFiles) => prevFiles.filter((_, index) => fileIds[index] !== fileId));
               setFileIds((prevIds) => prevIds.filter((id) => id !== fileId));
          }
          console.log('fichier supprimé avec succès', response.data);
        
          
  }catch(err){
    console.error('Erreur lors de la suppression du fichier à l id :', err);
  }}




  
  const handleSubmitParams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }


      const formData = new FormData();
      if (new_photo_profil) formData.append('image', new_photo_profil);
      if (newtelephone) formData.append('newtelephone', newtelephone);
      if (newGmail) formData.append('newGmail', newGmail);
      formData.append('username', username);
      formData.append('userprenom', userprenom);

      // Afficher un message de chargement uniquement si newGmail est rempli
      if (newGmail) {
        setModalMessage('Un email de confirmation vous a été envoyer dans votre boite mail !');
        setShowModal(true);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/change_params`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        if (newGmail && response.data.message.includes('email de confirmation')) {
          setModalMessage('Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.');
          setShowModal(true);
        } else {
          Router.reload();
          setShowModal(false);
        }
        console.log('Params changed successfully:', response.data);
      } else {
        setShowModal(false);
        seterror('Une erreur s\'est produite. Veuillez vérifier les informations fournies.');
      }
    } catch (error) {
      setShowModal(false);
      seterror('Une erreur s\'est produite. Veuillez réessayer.');
      console.error('Error updating params:', error);
    }
  };
  



  
    return(
        <>
        <div className={style.div_profile_page}>
        
        {/*DIV 1 */}
        <div>

       
            <div className={style.background_profile}></div>
            <div className={style.photo_de_profil}> 

                <div>
                <Image 
  className={style.profile_pic}
  src={imagePath} 
  width={350}       
  height={390}
  alt="Picture of the author"
  priority 
/>
                </div>
           
     <div className={style.nom_prenom}>
      <p> {username} {userprenom}</p>
      <h5> {usersecteur}</h5>
     </div>
            </div>


            <div className={style.info_complementaire}>
             
                <p> Telephone  <h5>+213 {usertelephone} </h5> </p> 
                <p> Date de naissance   <h5>{userdate ? userdate.slice(0, 10) : 'Non renseigné'} </h5> </p>
                <p> Adresse Mail   <h5>{user_Gmail} </h5> </p>
            </div>

            <button className={style.modifier_profil} onClick={handleAdd_parametre}> ⚙ </button>
            {isModalOpen_parametre && (
                        <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_offre}>
                                <p className={style.error}>  {error}</p>
                                <div className={style.grid_item}>
                                <h3 className={style.h3_telephone}> Changer De Numéro de Téléphone : <p> " Il sera utiliser en cas d'urgenre ou de besoin de la part de votre équipe ou de vos supérieurs ! "</p></h3><br/>
                                <input value={newtelephone} type="text" id="tentacles" name="tentacles" maxlength="10" pattern="\d*" oninput="this.value = this.value.replace(/[^0-9]/g, '');" className={style.input_telephone} placeholder='ex: 0554789699' onChange={(e)=> setnewtelephone(e.target.value)} />
                                </div>
<br/>
                                <div className={style.grid_item}>
                                <h3 className={style.h3_Gmail}> Ajouter votre Gmail : <p> " 
Ajoutez un Gmail pour renforcer la sécurité avec une double authentification, faciliter la récupération d'accès et recevoir des alertes fiables." </p> </h3><br/>
                                <input value={newGmail} type="text" id="newGmail" name="newGmail" maxlength="50" pattern="\d*"  className={style.input_Gmail} placeholder='ex: User0145@gmail.com' onChange={(e)=> setnewGmail(e.target.value)} />
                                </div>

                                <br/><br/>
                                <h3 className={style.h3_PFP} > Changer De Photo De Profile <p> " Uniquement les fichiers de types {'('} "Png", "Jpeg" , "Jpg" , "Jfif" {')'}" {'('}10Mb max{')'} </p>  </h3><br/>

                                <div className={style.fileUpload}>
  <input type="file"  name="file" id="fileInput" className={style.modal_file_choice}  onChange={handleProfilePicChange}  />
  <label htmlFor="fileInput" className={style.customFileLabel}>
    <span className={style.uploadButton}>Ajouter votre fichier ici ↓ </span>

    
  </label>
</div>
<br/>


{showModal && (
        <div className={style.modal}>
          <div className={style.modal_content}>
            <p>{modalMessage}</p>
            {modalMessage === 'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.' && (
              <button onClick={() => setShowModal(false)}>OK</button>
            )}
          </div>
        </div>
      )}


                                <div className={style.flex_item_center}>
                                <button className={style.modal_confirm_btn_offre} onClick={handleSubmitParams} > Enregistrer </button>
                                <button className={style.modal_close_btn_offre} onClick={handleClose_parametre}>Fermer</button>
                                 </div>
                                  </div>
                                  </div>
            )}
            </div>


            {/*DIV 2 */}
              
            <div className={style.bas}>
                <div className={style.div_documents}>
                    <h2> Tout les documents</h2>

                    <div className={style.div_type_fichier}>

                        <div>
                        <p onClick={()=>handleSelect('All_files')} className={selected==='All_files' ? style.selected:''}> All_files </p>
                        <p onClick={()=>handleSelect('Documents')} className={selected==='Documents' ? style.selected:''}> Documents </p>
                        <p onClick={()=>handleSelect('PDFs')} className={selected==='PDFs' ? style.selected:''}> PDFs </p>
                        <p onClick={()=>handleSelect('excel')} className={selected==='excel' ? style.selected:''}> excel </p>
                        <p onClick={()=>handleSelect('Images')} className={selected==='Images' ? style.selected:''}> Images </p>
                        </div>


                         </div>




                         <div className={style.recherche}>
                        <input type='text' placeholder='Recherche'  onChange={e => setrecherche(e.target.value)}/>
                         </div>

                         <div className={style.ajouter_file}>
                         <button onClick={handleAdd_offre} > + Ajouter Fichier</button>
                         {isModalOpen_offre && (
                        <div className={style.modal_container_profile}>
                                <div className={style.modal_container_rec_offre}>

                                <div className={style.fileUpload}>
                                  <p className={style.fileUpload_p}> Fichier autorisé sont :  <p> .png; </p> <p> .jpeg ; </p> <p> .jpg </p>  {' / '} 
                                      <p> .pdf </p>{' /'} 
                                      <p> .docx; </p> <p> .doc </p> {' / '}  
                                      <p> .xlsx;</p>  <p> .xls </p> {''}</p>
  <input type="file" id="fileInput" className={style.modal_file_choice}   onChange={handleFileChange}/>
  <label htmlFor="fileInput" className={style.customFileLabel}>
    <span className={style.uploadButton}>Ajouter votre fichier ici ↓ </span>
    <span className={style.fileName}>{fileName} {fileSize}</span>
    
  </label>
</div><br/>
<p className={style.error}>{error_file}</p>

                                    
                          <div className={style.flex_item_center}>
                          <button className={style.modal_confirm_btn_offre}  onClick={handleFileUpload}> Enregistrer </button>
                          <button className={style.modal_close_btn_offre} onClick={handleClose_offre}>Fermer</button>
                            </div>
                                    </div>
                                    </div>
                         )}
                            </div> 







                         <div className={style.fichiers}>

                         <div className={style.files}>
                            <table className={style.fileTable}>
                                <thead>
                                    <tr>
                                        <th className={style.th_Name}> Name </th>
                                        <th> Type </th>
                                        <th > Size </th>
                                        <th className={style.th_Size}>  </th>
                                    </tr>
                                </thead>
                                <tbody>
                {filteredFiles.map((filePath, index) => {
                    const fileName = filePath.split('/').pop();
                    const extension = fileName.split('.').pop();
                    const fileId = fileIds[index];
                    return (
                        <tr key={index}>
                            <td className={style.first_td}>
                                <div className={style.div_img_file}>
                                    <Image
                                        className={style.fichier_img}
                                        src="/publication.png"
                                        width={50}
                                        height={50}
                                        alt="File icon"
                                        priority
                                    />
                                </div>
                                <a href={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${filePath}`} download target="_blank" rel="noopener noreferrer">{fileName}</a>
                            </td>
                            <td className={style.infos_file}>{extension}</td>
                            <td className={style.infos_file}>{formatFileSize(userfile_size[index])}</td>
                            <td className={style.infos_file_a}>
                                <a onClick={() => handle_delete_file(fileId,fileName)}>Supprimer</a>
                            </td>
                        </tr>
                    );
                })}
            </tbody>


                            </table>

                         </div>

                         </div>
                </div>
            </div>









        </div>
        </>
    )
}