import style from '../../styles/Footer.module.css' ;
import Image from 'next/image';

export default function Footer(){
    return(
        <>
        <div className={style.footer}>
          
           {/* UP */}
          <div className={style.up}>

            <div>
            <Image
                       className={style.footer_img}
                       src="/ORDS.png"
                       width={150}       
                       height={100}
                       alt="Picture of the author"
                       priority 
                    />  
                    <h2>© Ooredoo 2024 | Plateforme de formation et espace de publication réservés aux employés | Confidentialité garantie.</h2>
            </div>


            <div>
                <h3>  Support </h3>
                <a href='#'> Contactez-nous</a>
                <a href='#'>Support </a>
                <a href='#'>Trouvez-nous </a>
                
                </div>


                <div>
                <h3>  Tout sur Ooredoo </h3>
                <a href='#'> A propos</a>
                <a href='#'>Devenez notre fourniseur (inscrivez-vous ici) </a>
                <a href='#'>catalogue d'interconnexion 2024-2025 </a>
                </div>


                <div>
                <h3>  Politique et qualité </h3>
                <a href='#'> Mentions légales</a>
                <a href='#'>Politique qualité </a>
                <a href='#'>ISO 9001 </a>
                <a href='#'>ISO-CEI 27001 </a>
                </div>

          </div>

            {/* DOWN */}
          <div className={style.down}>
            <div>
            <a href='#'> Politique qualité</a>
           <a href='#'> Contactez-nous </a>
           <a href='#'> Mentions légales </a>
           <a href='#'> whistleblowing </a>
            </div>
         
          </div>



        </div>
        </>
    )
}