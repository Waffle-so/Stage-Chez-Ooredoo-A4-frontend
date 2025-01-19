import Acceuil from "./Ooredoo/Acceuil/Acceuil";
import Formation from "./Formation/Formation";
import Publication from "./Publication/Publication";
import Report from "./Report/Report";
import Header from "./Header/Header";
import Page_One_For_All from "./Page_One_For_All";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Recup_Info(){
    const Router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // État de chargement
    const [userId, SetUserId] = useState('');
    const [username, SetUserName] = useState('');
    const [userprenom, SetUserPrenom] = useState('');
    const [usersecteur, setUserSecteur] = useState('');

    const authentificate = async() =>{
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                Router.push('/Login/Login');
                return;
            }

            const response = await axios.post('http://localhost:3001/profile', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                SetUserId(response.data.user.id);
                SetUserName(response.data.user.nom);
                SetUserPrenom(response.data.user.prenom);
                setUserSecteur(response.data.user.secteur);
                setLoggedIn(true);
             
            } else {
                setLoggedIn(false);
                Router.push('/Login/Login');
            }
        } catch(err) {
            console.log(err);
            setLoggedIn(false);
            Router.push('/Login/Login');
        } finally {
            setLoading(false); // Fin du chargement
        }
    }
/*
    useEffect(() => {
        authentificate();
    }, []);


*/


    useEffect(() => {
        if (!loading) {
            if (loggedIn) {
                Router.push('/Page_One_For_All');
            } else {
                Router.push('/Login/Login');
            }
        }
    }, [loggedIn, loading, Router]);


    if (loading) {
        return <div>Chargement...</div>; // Affichage pendant le chargement
    }


    return (
        <div>
            <Header loggedIn={loggedIn} username={username} userprenom={userprenom}  />
            {loggedIn ? (
                <>   

                    <Page_One_For_All username={username} userprenom={userprenom} usersecteur={usersecteur} />
                    <Formation username={username} userprenom={userprenom} />
                    <Publication username={username} userprenom={userprenom} />
                    <Report username={username} userprenom={userprenom} />
                </>
            ) : (
                <div>
                    <h1>Veuillez vous connecter</h1>
                    <Link href="./LOGIN/LOGIN">Connexion</Link>
                </div>
            )}
        </div>
    );
}
