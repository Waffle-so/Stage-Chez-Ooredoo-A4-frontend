import style from '../../styles/Profile_visit.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ProfileVisit() {
  const Router = useRouter();
  const { userId, userNom, userPrenom, user_image, usertelephone,user_Gmail ,usersecteur,userdate } = Router.query; // Récupère les paramètres d'URL
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [recherche, setRecherche] = useState('');
  const [selected, setSelected] = useState('All_files'); // État pour suivre l'élément sélectionné
  
  const [userfile_id,setuserfile_id]=useState([]);
  const [userfile_path,setuserfile_path]= useState([]);
  const [userfile_size,setuserfile_size]= useState([]);
  const [userfile_type,setuserfile_type]= useState([]);

  const imageName = user_image?.split(/[/\\]/).pop();
  const cleanedImageName = imageName?.replace(/^(public\/)?(files\/)?/, '');
  const imagePath = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${cleanedImageName}`;

  // Fonction pour filtrer les fichiers
  const filteredFiles = userfile_path.filter((filePath, index) => {
    const fileName = filePath.split('/').pop();
    const fileType = userfile_type[index];
    const extension = fileName.split('.').pop();
    const matchesSearch = fileName.toLowerCase().includes(recherche.toLowerCase());
  
    if (selected === 'All_files') {
      return matchesSearch;
    } else if (selected === 'Documents') {
      return matchesSearch && ['doc', 'docx'].includes(extension.toLowerCase());
    } else if (selected === 'PDFs') {
      return matchesSearch && fileType === 'application/pdf';
    } else if (selected === 'excel') {
      return matchesSearch && ['xls', 'xlsx'].includes(extension.toLowerCase());
    } else if (selected === 'Images') {
      return matchesSearch && ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase());
    }
  
    return false;
  });
  
  
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




  // Fonction pour récupérer les fichiers
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (token && userId) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/user_files_per_id`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
        const files =response.data.files || [];
        setuserfile_id(files.map(File=>File.id));
        setuserfile_path(files.map(File=>File.file_path));
        setuserfile_size(files.map(File=>File.file_size));
        setuserfile_type(files.map(File=>File.file_type));
        setLoading(false);
        console.log('voici les files:', files);

      } else {
        console.log('les fichiers non pas été retrouver ! ');
        setLoggedIn(false);
        Router.push('/Login2/Login2');
      }
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        Router.push('/Login/Login');
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    
    <div className={style.div_profile_page}>
      {/* Profile Header */}
      <div>

      
      <div className={style.background_profile}></div>
      <div className={style.photo_de_profil}>
        <div>
            <Image
          className={style.profile_pic}
          src={imagePath}
          width={350}
          height={390}
          alt="Profile picture"
          priority
        />
        </div>
        
        <div className={style.nom_prenom}>
          <p>{userNom} {userPrenom}</p>
          <h5>{usersecteur}</h5>
        </div>
      </div>

      <div className={style.info_complementaire}>
        <p>Telephone <h5>+213 {usertelephone}</h5></p>
        <p>Date de naissance <h5>{userdate ? userdate.slice(0, 10) : 'Non renseigné'}</h5></p>
        <p>Adresse Mail <h5>{user_Gmail}</h5></p>
      </div>

      </div>


      {/* File Section */}
      <div className={style.bas}>
        <div className={style.div_documents}>
          <h2>Tout les documents</h2>

          <div className={style.div_type_fichier}>

            <div>
              <p onClick={() => setSelected('All_files')} className={selected === 'All_files' ? style.selected : ''}>All files</p>
              <p onClick={() => setSelected('Documents')} className={selected === 'Documents' ? style.selected : ''}>Documents</p>
              <p onClick={() => setSelected('PDFs')} className={selected === 'PDFs' ? style.selected : ''}>PDFs</p>
              <p onClick={() => setSelected('excel')} className={selected === 'excel' ? style.selected : ''}>Excel</p>
              <p onClick={() => setSelected('Images')} className={selected === 'Images' ? style.selected : ''}>Images</p>
            </div>


          </div>

          <div className={style.recherche}>
            <input
              type="text"
              placeholder="Recherche"
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>

        

          <div className={style.fichiers}>
          <div className={style.files}>
            <table className={style.fileTable}>
              <thead>
                <tr>
                  <th className={style.th_Name}>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th className={style.th_Size}></th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((filePath, index) => {
                    const fileName = filePath.split('/').pop(); // Nom du fichier
                    const fileId = userfile_id[index]; // ID du fichier
                    const fileSize = userfile_size[index]; // Taille du fichier
                    const fileType = userfile_type[index]; // Type MIME du fichier
                    const extension = fileName.split('.').pop(); // Extension du fichier
                  return (
                    <tr key={fileId}>
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
                        <a href={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${filePath}`} download target="_blank" rel="noopener noreferrer">
                          {fileName}
                        </a>
                      </td>
                      <td className={style.infos_file}>{fileType}</td>
                      <td className={style.infos_file}>{formatFileSize(fileSize)}</td>
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
  );
}
