import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/router'; 
import axios from 'axios'; 
import style from '../../styles/Confirmer.module.css';

const ConfirmEmail = () => {
  const [message, setMessage] = useState(''); 
  const [isConfirmed, setIsConfirmed] = useState(false); 
  const router = useRouter();

  // Utilisation de useEffect pour récupérer l'URL entière et extraire le token et l'email
  useEffect(() => {
    // Vérifie si l'URL est bien prête
    if (router.asPath) {
      console.log('URL complète: ', router.asPath);
      // Ici, l'URL a la forme /confirm-email/<token>,<email>
      const urlParts = router.asPath.split('/confirm-email/')[1]; // On récupère la partie après /confirm-email/
      
      if (urlParts) {
        const [token, email] = decodeURIComponent(urlParts).split(','); // Décoder et séparer token et email
        if (token && email) {
          confirmEmail(token, email); // Appeler la fonction avec le token et l'email
        } else {
          setMessage('Token ou email manquant.');
        }
      }
    }
  }, [router.asPath]); // Dépend de la route entière (asPath)

  // Fonction de confirmation
  const confirmEmail = async (token, email) => {
    if (!token || !email) {
      console.error('Token ou email manquant');
      return;
    }

    console.log('Token trouvé:', token);
    console.log('Email trouvé:', email);

    try {
      // Envoie de la requête API avec le token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/confirm-email/${token}`,
        { email }  // Envoi de l'email dans le corps de la requête
      );

      setMessage(response.data.message);

      if (response.data) {
        setIsConfirmed(true);
        console.log('Confirmation réussie:', response.data.message);

        // Rediriger après confirmation
        setTimeout(() => {
          router.push('http://localhost:3000/Page_One_For_All?page=Profile');  // Remplacer par la page de votre choix
        }, 100);
      } else {
        setMessage('Erreur de confirmation.');
        console.log('Échec de la confirmation');
      }
    } catch (error) {
      setMessage('Une erreur est survenue lors de la confirmation.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className={style.page}>
      <h1>Confirmation de l'email</h1>
      {isConfirmed ? (
        <p>Email confirmé avec succès. Vous serez redirigé...</p>
      ) : (
        <p>{message || 'Chargement...'}</p>
      )}
    </div>
  );
};

export default ConfirmEmail;
