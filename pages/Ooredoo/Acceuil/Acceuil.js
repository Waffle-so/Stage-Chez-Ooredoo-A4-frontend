import style from '../../../styles/Acceuil.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Acceuil({username,userprenom,usersecteur,userfile_id,notificationCount,user_role}){

    useEffect(() => {
        const elements = document.querySelectorAll(`.${style.hiddenElement}`);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(style.visibleElement);
                    } else {
                        entry.target.classList.remove(style.visibleElement);
                    }
                });
            },
            { threshold: 0.1 }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            elements.forEach((element) => observer.unobserve(element));
        };
    }, []);

    return(
        <>
        <div>
         

          {/* Div droite */}
            <div className={style.Part1}>
                 
                 {/* Section titre*/}

                <div className={`${style.div_titre} ${style.hiddenElement}`}>
                <h1 className={style.titre}>
                    Your learning
                    wonderfully <br/>
                     connected
                </h1>

               <br/>
               <p className={style.new_way}> New way to work </p><br/>
               <p className={style.crafted}>
               "Conçu avec soin pour offrir des solutions innovantes aux <br/> professionnels."</p>
               <Image
                className={style.stat}
                src="/stat.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              />
 {/* Section bouton*/}

                <div className={style.intro_but}>
              
                    <Link href={"https://www.youtube.com/watch?v=gjFFKlzE9lA"}> <button> Introduction Video → </button> </Link>
                    <button> Commencer </button>
                </div>

                <Image
                className={style.chap}
                src="/mortarboard.png"
                width={350}
                height={350}
                alt="Picture of the author"
                priority
              />
               {/* Section titre et checkbox*/}

                <div className={style.checkbox}>
                    <div>
                    <label> <p>✔</p></label>
                    <p className={style.text_right_checkbox}>Apprentissage</p>
                    </div>

                    <div>
                    <label><p>✔</p></label>
                    <p className={style.text_right_checkbox}>Communication</p>
                    </div>

                    <div>
                    <label><p>✔</p></label>
                    <p className={style.text_right_checkbox}>Progrés</p>
                    </div>
                   
                </div>


 {/* Div droite */}
 <div  className={`${style.Part2} ${style.hiddenElement}`} >

<div className={style.image1}>
    <h2> {username} {userprenom} <br/> <p className={style.user_role}> ({user_role})</p></h2> <h5> •••</h5>

    <div className={style.part_dessous}>
        <div className={style.img_card}>
        <Image
className={style.profile}
src="/sun.png"
width={80}       
height={80}
alt="Picture of the author"
priority 
/> <p> Informations Sur Vous</p>
        </div>

        <div className={style.info_card}>

        <div className={style.sous_info_card}>

        <div>
                <Image
className={style.icon}
src="/publication.png"
width={80}       
height={80}
alt="Picture of the author"
priority 
/>   
                <p> {userfile_id.length} Publications </p>
           
                </div>
           

            <div>
            <Image
className={style.icon}
src="/message.png"
width={100}       
height={100}
alt="Picture of the author"
priority 
/>   
            <p> {notificationCount > 0 ? (
<>{notificationCount} </>
) : (
<>0 </>
)}
Messages </p>

            </div>

        </div>
               
        

           
       
        </div>

    
       

         <div className={style.dessous_card}>
         <p> Service : </p> <h3> {usersecteur} </h3>
         <button> Continuer </button>
         </div>
        
        
    </div>
</div>



</div>
               

                </div>




         


                


    {/* deuxieme card */}
    <div   className={`${style.card2} ${style.hiddenElement}`} > 
                    
                    <div className={style.Titre_card2}> <p> Video </p> <p>...</p></div>
                    <div className={style.card2_div2}> 

                    <div className={style.video_card2}></div>
                    <div className={style.video_card2_titre}></div>
                    <div className={style.video_card2_titre2}></div>

                    <div className={style.flexing_profile_titre}>
                    <div className={style.profile_card2}></div>
                    <div className={style.profile_titre}></div>
                    <div className={style.profile_titre2}></div>
                    </div>

                    </div>          

                    </div>





                


            </div>












            <div  className={`${style.Big_Part2} ${style.hiddenElement}`}>

                <div className={`${style.middle_page} ${style.hiddenElement}`} > 


                    <div className={style.trusted_all_div}> {/*  A ajouter ici */}
              <p className={style.trusted_by}> Trusted by established companies && technologies used </p>
               <Image
                       className={style.trusted}
                       src="/cesi_logo.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
               <Image
                       className={style.trusted2}
                       src="/ooredoo-removebg-preview.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  





                    <div className={style.flexing_trusted}>
                    <Image
                       className={style.trusted_docker}
                       src="/docker.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    <Image
                       className={style.trusted3}
                       src="/ngi.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    <Image
                       className={style.trusted3}
                       src="/nd.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    <Image
                       className={style.trusted3}
                       src="/pg.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                  
                    <Image
                       className={style.trusted4}
                       src="/postman.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    /> 
                    <Image
                       className={style.trusted4}
                       src="/Socket.io.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    /> 
                    <Image
                       className={style.trusted4}
                       src="/cursor.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    /> 
                      <Image
                       className={style.trusted4}
                       src="/nx.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    </div>
                        </div>


              


                </div>

                <div className={style.trusted_by_div}>

                     <div className={style.trusted_by_div_1}>
                     <Image
                       className={style.logo_trusted_by}
                       src="/ooredoo-removebg-preview.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    <p>  * L’objectif est de développer une plateforme de formation en ligne innovante, dédiée à l'amélioration des compétences techniques des employés d’Ooredoo. 
                    Ce projet vise à optimiser la formation interne et l’adoption de nouvelles technologies, tout en garantissant la sécurité des informations sensibles. </p>

                        <button> En savoir plus → </button>
                     </div>

                     <div className={style.trusted_by_div_2}>
                     <Image
                       className={style.logo_trusted_by}
                       src="/ooredoo-removebg-preview.png"
                       width={300}       
                       height={300}
                       alt="Picture of the author"
                       priority 
                    />  
                    <p> * L'application facilite l'accès à des contenus techniques innovants pour la formation continue, favorisant l'adoption de nouvelles technologies et assurant une communication sécurisée entre les secteurs de l'entreprise. </p>
                        <button>  Services → </button>
                     </div>

                </div>



            </div>








            <div className={`${style.Big_Part3} ${style.hiddenElement}`} >
                <div className={style.middle_Big_Part3}>


                <div className={style.gauche_BigPart3}>
                    <h1> Connecter vous <br/>avec vos <br/>collégues. </h1>
                    <a href='#'> Read More →</a>

                    <div className={style.card_BigPart3}>
                    <Image
                       className={style.image_big3}
                       src="/fille.jfif"
                       width={150}       
                       height={150}
                       alt="Picture of the author"
                       priority 
                    />  
                        <h1> Sofiane Merjana </h1>
                        <h5> Administrateur</h5>
                        <p> "Bienvenue à notre plateforme, un espace dédié à l'amélioration des compétences et à la collaboration efficace entre employés."</p>
                        <p className={style.datee}> . 2024-09-04 .  </p>
                    </div>

                </div>

                <Image
                       className={style.middle_g_d}
                       src="/next-icon.png"
                       width={190}       
                       height={190}
                       alt="Picture of the author"
                       priority 
                    />  


                 <div className={style.droite_BigPart3}>
                    <div className={style.in_div_droite_BigPart3}>
                        <div className={style.card_tablette}>
                            <div className={style.searchNothing}> <input type='text' placeholder=' 🔎 Search '></input></div>

                            <div className={style.photo_profile}>
                                <h1> Connected</h1>
                                <h5> Utilisateurs </h5>
                                
                                <div className={style.ph_pro_flex}>
                       <Image
                       className={style.photo_profile1}
                       src="/bleu.png"
                       width={150}       
                       height={150}
                       alt="Picture of the author"
                       priority 
                    />  
                    <p> Mohamed Raouf. </p>

                    
                                </div>
                                <h4>Oublier pas le point de rendez-...</h4>
                                <h3> 12:58</h3>

                                <div className={style.ph_pro_flex}>
                      <Image
                       className={style.photo_profile1}
                       src="/bleu.png"
                       width={200}       
                       height={200}
                       alt="Picture of the author"
                       priority 
                    /> 
                    <p> Abdelraouf Karim. </p>
                    
                                </div>
                               
                                <h4>Parfait c'est bien reçus, attends...</h4>
                                <h3> 15:00</h3>

                                
                                <div className={style.ph_pro_flex}>
                                <Image
                       className={style.photo_profile1}
                       src="/bleu.png"
                       width={200}       
                       height={200}
                       alt="Picture of the author"
                       priority 
                    /> 
                    <p> Djamila Charkout. </p>
                                    
                                </div>
                                <h4> J'attends encore les fichiers...</h4>
                                <h3> 09:15</h3>
                           
                                 </div>

                                 <div className={style.options_div}>
                                 <h1> Options</h1>

                                 
                                 <div>
                    <label><p>✔</p></label>
                    <p className={style.text_right_checkbox_options}>Recevoir notification. </p>
                                 </div>

                                 <div>
                    <label><p>✔</p></label>
                    <p className={style.text_right_checkbox_options}>Status en ligne.</p>
                                 </div>

                                 <div>
                    <label><p>✔</p></label>
                    <p className={style.text_right_checkbox_options}>Custom.</p>
                                 </div>

                                 <h5> Vous avez Rendez-vous 11h !</h5>




                                 </div>

                                
                           

                        </div>

                    </div>
                </div>


                </div>

              

            </div>

            

        </div>
        
        </>
    )
}