import style from '../../styles/page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';


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



    useEffect(() => {
        // Rediriger vers la page de login
        router.push('/Login/login');
    }, [router]);

    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState(null);

    // password : $2b$10$AP9gkNZDnZt1MxRDYUNvFO37Ahz0WevIBN78R4z.iYpx61stNiIFa  .signifie: 1234567891

    Axios.defaults.withCredentials = true;

    function handelSubmit(e) {
        e.preventDefault();
        setError(null);

        Axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/login`, { email, password })
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
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/forgot_password`,{ email:email},
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
                `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/verifyResetCode`,
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
    
      





    return (
        <>
            <div className={style.div1}>
                <div className={style.div_droite}></div>

                <div className={style.traffic_lights}>
                    <div className={style.red}></div>
                    <div className={style.orange}></div>
                    <div className={style.green}></div>
                </div>

                <div className={style.div_login}>
                    <div className={style.center}>
                        <div className={style.welcome}>
                            <div className={style.flexing}>
                                <p className={style.signup}>Ooredoo</p>
                                <p className={style.signup2}>CORPORATION</p>
                            </div>
                            <div className={style.flexing2}>
                                <h2 className={style.h2}>Welcome Back!</h2>
                                <p className={style.paragraphe}>
                                    Si vous êtes pas encore inscrit, ou une erreur persiste <br/>demander à vos supérieurs !
                                </p>
                            </div>
                        </div>

                        <div className={style.info}>
                            <form onSubmit={handelSubmit}>
                                <div>
                                    {error && (
                                        <div className="error-message">
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className={style.dessus}> 
                                    <label className={style.label}>Email</label><br/>
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        value={email}
                                        onChange={e => setemail(e.target.value)}
                                    />
                                    </div>
                                    

                                <div className={style.dessus}> 
                                <label className={style.label}>
                                        Password <a onClick={handleopen_modal}>Forgot Password?</a>
                                    </label><br/>
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={password}
                                        onChange={e => setpassword(e.target.value)}
                                    />
                                    </div>
                                   
                                    
                                    <button type='submit'>LOG IN</button>
                                </div>

                               
                            </form>
                            {modal_forgot_pass &&(
                                <>
                                   <div className={style.modal_container_profile}>
                                   <div className={style.modal_container_rec_offre}>
                                    <h2> Mot de passe oublier ? </h2>
                                    <p> Avez Vous oublier votre mot de passe ?<br/><br/> Si c'est le cas nous allons vous envoyer un code temporaire a votre adresse Gmail. </p>
                                    <button onClick={() => { handleopen_modal_confirm(); handleForget_password(); }}> <a>Envoyer un code vérification</a>  </button>    
                                     <button onClick={handleClose_modal}> Fermer  </button>    
                                    </div>
                                    </div>
                                </>
                            )}


                            {modal_confirm_pass &&(
                                <>
                                   <div className={style.modal_container_profile}>
                                   <div className={style.modal_container_rec_offre}>
                                    <h2> Veuiller confirmer votre mot de passe : </h2>
                                    <p> Un mot de passe à 6 chiffres à été envoyer veillez vérifier votre boite mail: </p>
                                     <input type='number'  onChange={(e) => set_password_forget(e.target.value)}/><br/><br/>
                                     <button onClick={handle_verify_resetCode}> Confirmer </button>
                                     <button onClick={handleClose_modal_confirm}> Fermer  </button>    
                                    </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
