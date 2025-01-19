import style from '../../styles/Login2.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import Image from 'next/image';

export default function Login() {
    const router = useRouter();
    const [modal_forgot_pass,setmodal_forgot_pass]=useState(false);
    const [modal_confirm_pass,setmodal_confirm_pass]=useState(false);
    const [password_forgot,set_password_forget]=useState('')


     /*DEBUT MODAL modal */ 
   const handleopen_modal = () => { setmodal_forgot_pass(true); };
   const handleClose_modal = () => {  setmodal_forgot_pass(false);};
/*FIN*/ 

/*DEBUT MODAL modal */ 
const handleopen_modal_confirm = () => { setmodal_confirm_pass(true);  setmodal_forgot_pass(false);};
const handleClose_modal_confirm = () => {  setmodal_confirm_pass(false);};
/*FIN*/ 




const [email, setemail] = useState('');
const [password, setpassword] = useState('');
const [error, setError] = useState(null);

// password : $2b$10$AP9gkNZDnZt1MxRDYUNvFO37Ahz0WevIBN78R4z.iYpx61stNiIFa  .signifie: 1234567891

Axios.defaults.withCredentials = true;

function handelSubmit(e) {
    e.preventDefault();
    setError(null);

    Axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/login`, { email, password })
        .then(res => {
            if (res.data.success) {
                const token = res.data.token;
                localStorage.setItem('token', token);
                console.log('le token dans recup info: ', token);
                console.log(res.data);
                console.log("Données utilisateur reçues lors de la connexion:", res.data.message);
                window.location.href = res.data.redirectTo || "/Page_One_For_All";
            } else {
                setError(res.data.message);
            }
        })
        .catch(err => {
            if (err.response && err.response.status === 429) {
                // Rediriger vers la page de login si le statut est 429
                if (err.response.data.redirect) {
                    router.push(err.response.data.redirect);
                } else {
                    setError("Trop de tentatives, veuillez réessayer plus tard.");
                }
            } else {
                setError("Une erreur s'est produite. Réessayez !");
            }
        });
}


const handleForget_password = async () => {
    try {


      const response = await Axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/forgot_password`,{ email:email},
      );
      console.log('Requete d oublie de mot de passe send successfully:', response.data);
      // Réinitialiser le champ de description après l'envoi
      //router.reload();
    } catch (error) {
      console.error('Error sending request for changing password :', error);
    
    }
  };




  const handle_verify_resetCode = async () => {
    try {
        const response = await Axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/verifyResetCode`,
            { email: email, resetCode: password_forgot }
        );

        console.log('Requête de vérification de mot de passe envoyée avec succès :', response.data);

        if (response.data.success) {
            const token = response.data.token;
            localStorage.setItem('token', token);
            console.log('le token dans recup info: ', token);
            router.push('/Page_One_For_All');
        } else {
            alert(response.data.message || 'Code de vérification invalide.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du code de réinitialisation :', error);
        alert('Une erreur est survenue lors de la vérification. Veuillez réessayer.');
    }
};

  







    return(
        <>

        <div className={style.Div_all_Login}>
           

            <div className={style.Partie_gauche}>
                <div className={style.div_in_gauche}>
                <Image
                        src='/ooredoo-removebg-preview.png'
                        alt="Profil"
                        width={190}
                        height={190}
                        style={{ borderRadius: '50%' }}
                        className={style.logo}
                      /><br/><br/>
               <h1> Commencez avec nous </h1>
                <p> Compléter ces trois étapes faciles pour enregistrer <br/>votre compte </p><br/><br/>

               <div className={style.div_grid}>
                   <div className={style.div1}>  <p> <label> 1</label>   Connecter Vous à votre compte </p></div>
                   <div className={style.div1}> <p> <label> 2</label>   Configurer votre espace de travail </p> </div>
                   <div className={style.div1}><p> <label> 3</label>   Configurer Votre profile </p> </div>
               </div>
             
                </div>
                
                

            </div>




            <div className={style.Partie_droite}>
                <div className={style.div_in_droite} >

                    <h1> Conncetez-vous à votre compte</h1>
                    <p>Entrer vos données personnels</p>
                  <form onSubmit={handelSubmit}>
                    <div className={style.form_data}> 
                    
                        <label>Email </label>
                        <input type='email' placeholder='Email' value={email} onChange={e => setemail(e.target.value)}/>
                        <br/>


                        <div className={style.div_pass}> 
                        <label >Password </label> <a onClick={handleopen_modal} style={{ cursor: 'pointer' }}>Reset password </a>
                        </div>  
                        <input type='password' placeholder='Password'   value={password} onChange={e => setpassword(e.target.value)}  />
                        <p className={style.p_password}> Devrait avoir au moins 10 caractéres </p>
                        <br/><br/>
                        <button type='submit'> Se connecter </button>
                        {error && (
                                        <div className="error-message">
                                            <span>{error}</span>
                                        </div>
                                    )}
                        
                       
                    </div>
                    </form>
                    <h5>Si vous posséder aucun compte ou qu'un probléme survient <br/>contacter vos supérieurs</h5>
                    {modal_forgot_pass &&(
                                <>
                                   <div className={style.modal_container_profile}>
                                   <div className={style.modal_container_rec_offre}>
                                    <h2> Mot de passe oublier ? </h2>
                                    <p> Avez Vous oublier votre mot de passe ?<br/><br/> Si c'est le cas nous allons vous envoyer un code temporaire a votre adresse Gmail. </p>
                                    <button onClick={() => { handleopen_modal_confirm(); handleForget_password(); }} style={{ cursor: 'pointer' }}> <a>Envoyer un code vérification</a>  </button>    <br/>
                                     <button onClick={handleClose_modal} style={{ cursor: 'pointer' }}> Fermer  </button>    
                                    </div>
                                    </div>
                                </>
                            )}


                            {modal_confirm_pass &&(
                                <>
                                   <div className={style.modal_container_profile}>
                                   <div className={style.modal_container_rec_offre}>
                                    <h2>  Confirmer votre mot de passe : </h2>
                                    <p> Un mot de passe à 6 chiffres à été envoyer veillez vérifier votre boite mail: </p>
                                     <input type='number'  onChange={(e) => set_password_forget(e.target.value)}/><br/><br/>
                                     <button onClick={handle_verify_resetCode}  style={{ cursor: 'pointer' }}> Confirmer </button>
                                     <button onClick={handleClose_modal_confirm}  style={{ cursor: 'pointer' }}> Fermer  </button>    
                                    </div>
                                    </div>
                                </>
                            )}

                </div>
            </div>
                
        
           
       
        </div>
        </>
    )
}