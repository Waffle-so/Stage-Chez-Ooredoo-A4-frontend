import style from '../styles/page.module.css' 
import dynamic from 'next/dynamic';
import Login from './Login/Login';
import Head from 'next/head';
import Link from 'next/link'

//const Image = dynamic(() => import('next/image'));

//npm run dev
/*
<Image
      className='image-back'
      src="/Image/pic.jpg"
      width={500}       
      height={500}
      alt="Picture of the author"
      priority 
     />
*/

/*
<Button/>
*/ 

export default function Home() {
  return (
<>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>

<Head>
  <title> Login </title>
</Head>


</>

  );

}
