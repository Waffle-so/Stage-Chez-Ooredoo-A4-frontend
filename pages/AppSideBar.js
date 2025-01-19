import { useState, useEffect } from 'react';
import styles from '../styles/Sidebar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router'; 
import axios from 'axios';
import io from 'socket.io-client';

const Sidebar = ({ userId, currentPage, setPage ,user_image,usersecteur,onNotificationCountChange,username,userprenom,user_Gmail }) => {
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [connectedUsers, setAllConnectedUsers] = useState([]);
  const [ismodalMessage, isModalMessageSet] = useState(false);
  const [ismodalMessage2, isModalMessageSet2] = useState(false);
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setsocket] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [allusers,setallusers]=useState([]);
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);




  const toggleLogout = () => {
    setIsLogoutVisible(!isLogoutVisible);
  };

  useEffect(() => {
    // Met à jour le nombre de notifications dans le parent
    onNotificationCountChange(notificationCount);
  }, [notificationCount]); // Dépendance sur notificationCount

  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOpen_message = (userId) => {
    setallusers(prevUsers => prevUsers.map(user=> user.userId === userId ? {...user, hasNewMessage:false} : user));
    setAllConnectedUsers(prevUsers => prevUsers.map(user=> user.userId === userId ? {...user, hasNewMessage:false} : user));
    setCurrentChatUserId(userId);
    setSelectedChatUserId(userId);
    isModalMessageSet(false);isModalMessageSet2(true)
    setNotificationCount(0);
  };

  const handleClose_message = () => {
    isModalMessageSet(false);
    isModalMessageSet2(false);
    setCurrentChatUserId(null);
    setSelectedChatUserId(null); // Réinitialiser selectedChatUserId
  };



 


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      Router.push('/Login2/Login2');
      return;
    }
  
    const newsocket = io(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      withCredentials: true,
      transports: ['websocket'],
      auth: { token: token },
    });
  
    setsocket(newsocket);
  
    // Gérer l'événement connect
    newsocket.on('api/connect', async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        newsocket.emit('/api/user_connected', storedUserId);
  
        try {
          // Récupérer les messages via l'API REST
          const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/messages`, {
            params: {
              userId: storedUserId,
              chatUserId: selectedChatUserId, // Remplacez `selectedChatUserId` par l'ID du destinataire actuel
            },
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.data && response.data.messages) {
            setMessages(response.data.messages); // Met à jour l'état avec les messages récupérés
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des messages:', error);
        }
      }
    });
  
    // Événements socket pour gérer les utilisateurs connectés
    newsocket.on('/api/connected_users', (users) => {
      const filterdUsers = users.filter(user => user.secteur === usersecteur && user.status === 1);
      setAllConnectedUsers(filterdUsers);
    });
  
    newsocket.on('/api/user_status', (data) => {
      console.log(`User ${data.userId} status: ${data.status}`);
    });
  
    newsocket.on('/api/get_all_users', (users) => {
      const filterusers = users.filter(user => user.secteur === usersecteur && user.userId !== userId);
      setallusers(filterusers);
    });
  
    // Nettoyage
    return () => {
      newsocket.disconnect();
    };
  }, [Router, userId, usersecteur, selectedChatUserId]);
  





  useEffect(() => {
    if (!socket) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé");
      Router.push('/Login2/Login2');
      return;
    }

    // Récupérer les messages lorsque l'utilisateur se reconnecte ou actualise la page
    const fetchMessages = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/messages`, null,
          {
          params: { userId, chatUserId: currentChatUserId },
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        
        setMessages(response.data.messages);
        console.log('voici messages ici : ',response.data.messages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    };
  
    if (currentChatUserId) {
      fetchMessages();
    }
  
  }, [socket, currentChatUserId, userId]);
  



  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  
 // Gestion des événements socket
 useEffect(() => {
  if (!socket) return;

  const handleReceiveMessage = (data) => {
    const { senderId, recipientId, content ,timestamp} = data;

    // Notification pour un message entrant
    if (recipientId === userId) {
      setallusers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === senderId ? { ...user, hasNewMessage: true } : user
        )
      );
      setNotificationCount((prevCount) => prevCount + 1);
    }

    // Mise à jour des messages
    if (recipientId === userId || senderId === userId) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, formattedTimestamp: formatTimestamp(timestamp) }
      ]);
      
    }
  };

  const handleReconnect = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      socket.emit('api/user_connected', storedUserId);
    }
  };



  // Gestion des utilisateurs connectés
  const updateConnectedUsers = (users) => {
    const filteredUsers = users.filter(
      (user) => user.secteur === usersecteur && user.status === 1
    );
    setAllConnectedUsers(filteredUsers);
  };

  socket.on('/api/receive_message', handleReceiveMessage);
  socket.on('api/reconnect', handleReconnect);
  //socket.on('api/connected_users', updateConnectedUsers);
  socket.on('/api/connected_users', updateConnectedUsers);

  
  // Nettoyage
  return () => {
    socket.off('/api/receive_message', handleReceiveMessage);
    socket.off('api/reconnect', handleReconnect);
    socket.off('/api/connected_users', updateConnectedUsers);
    
  };
}, [socket, usersecteur]);


const handleUserDisconnect = (userId) => {
  setAllConnectedUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
};

useEffect(() => {
  if (!socket) return;

  socket.on('api/user_disconnected', handleUserDisconnect);

  return () => {
    socket.off('api/user_disconnected', handleUserDisconnect);
  };
}, [socket]);


 // Charger tous les utilisateurs
 useEffect(() => {
  if (!socket) return;

  socket.emit('/api/get_all_users', (response) => {
    if (response.success) {
      const filteredUsers = response.users.filter(
        (user) => user.secteur === usersecteur && user.userId !== userId
      );
      setallusers(filteredUsers);
    } else {
      console.error('Erreur lors de la récupération des utilisateurs:', response.error);
    }
  });
}, [socket, usersecteur, userId]);



  const filteredMessages = messages.filter(msg =>
    (String(msg.senderId) === String(userId) && String(msg.recipientId) === String(currentChatUserId)) ||
    (String(msg.senderId) === String(currentChatUserId) && String(msg.recipientId) === String(userId))
  );

  const sendMessage = () => {
    if (message.trim() !== "" && currentChatUserId && socket) {
      const newMessage = {
        senderId: userId,
        recipientId: currentChatUserId,
        content: message,
        timestamp: new Date().toISOString(),
      };
  
      // Envoyer le message via le socket
      socket.emit('/api/send_message', newMessage);
  
      // Ajouter le message immédiatement à l'état local pour l'afficher
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Vider la zone de texte après l'envoi
      setMessage("");
    }
  };
  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token non trouvé");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/api/logout`,
        {username:username, userprenom:userprenom},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        socket.emit('/api/disconnect');
        socket.emit('/api/update_connected_users'); 
        localStorage.removeItem('token');
        Router.push('/Login2/Login2');
      } else {
        console.error("Erreur de déconnexion:", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête de déconnexion :", error);
    }
  };

  const getImagePath = (photoprofil) => {
    const imageName = photoprofil ? photoprofil.split(/[/\\]/).pop() : 'default-profile.jpg'; 
    return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL_REQUETE_BACKEND}/files/${imageName}`;
  };

  const getChatUserName = (userId) => {
    const user = allusers.find(user => user.userId === userId);
    return user ? user.userName : "Utilisateur inconnu";
  };

  const getChatUserrole = (userId) => {
    const user = allusers.find(user => user.userId === userId);
    return user ? user.role : "Utilisateur inconnu";
  };

  const getImageUser= (userId)=>{
    const user = allusers.find(user => user.userId === userId);
    return user ? user.photoprofil : 'photo inconnu';
  }










  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <button
        className={styles.toggleButton}
        style={{ left: isOpen ? '-70px' : '0', marginLeft: isOpen ? '0' : '-100px' }}
        onClick={toggleSidebar}
      >
        <Image className={styles.Image} src='/mess.png' width={50} height={50} alt="Toggle Sidebar" priority />
      </button>

      {isOpen && (
        <>
          <div className={styles.flexing}>
            <Image className={styles.img_2} src="/chat.png" width={50} height={50} alt="Chat Icon" priority />
            <h2 className={styles.header}>Messages</h2>
          </div>

          <div className={styles.messages}>
            <h3 className={styles.number_of_connect}>Membres Connecté <p>{connectedUsers.length-1}</p></h3>
            <ul>
  {allusers
    .filter(user => user.status === 1) // Filtre pour les utilisateurs non connectés (status === 0) ou connectés (status === 1)
    .map((user, index) => (
      <li
        key={index}
        className={`${styles.li_connected_users} ${user.hasNewMessage ? styles.newMessage : ''}`}
        onClick={() => handleOpen_message(user.userId)}
      >
        <Image
          className={styles.ph_profil}
          src={getImagePath(user.photoprofil)}
          width={300}
          height={300}
          alt={`${user.userName} profile picture`}
          priority
        />

        <div>
        {user.status === 1 ? (
  <div className={styles.status}></div>
) : (
  <>
    {console.log(`Rendering status2 for user: ${user.userName}, status: ${user.status}`)}
    <div className={styles.status_no}></div>
  </>
)}

        </div>
         
        <p onClick={() => handleOpen_message(user.userId)} style={{ cursor: 'pointer' }}>{user.userName}</p>

        <Image
          className={styles.chat}
          src="/mess.png"
          width={50}
          height={50}
          alt="Chat"
          style={{ cursor: 'pointer' }}
          priority
          onClick={() => handleOpen_message(user.userId)}
        />
        <br />
        <br />

        {user.hasNewMessage && <span className={styles.notification}> + Nouveau message </span>}
      </li>
    ))}<p className={styles.separateur}>__________________________</p>
    
    
</ul>




<ul>
  {allusers
    .filter(user => user.status === 0) // Filtre pour les utilisateurs non connectés (status === 0) ou connectés (status === 1)
    .map((user, index) => (
      <li
        key={index}
        className={`${styles.li_no_connected_users} ${user.hasNewMessage ? styles.newMessage : ''}`}
      
      >
        <Image
          className={styles.ph_profil}
          src={getImagePath(user.photoprofil)}
          width={300}
          height={300}
          alt={`${user.userName} profile picture`}
          priority
        />

        <div>
        {user.status === 1 ? (
  <div className={styles.status}></div>
) : (
  <>
    {/*console.log(`Rendering status2 for user: ${user.userName}, status: ${user.status}`)*/}
    <div className={styles.status_no}></div>
  </>
)}

        </div>

        <p  className={styles.p_no_online}>{user.userName}</p>

       
        <br />
        <br />

        {user.hasNewMessage && <span className={styles.notification}> + Nouveau message </span>}
      </li>
    ))}
</ul>


          </div>
        



          {ismodalMessage && currentChatUserId && (
            <div className={styles.modal_container_profile}>
              <div className={styles.modal_container_rec_offre}>

                <div className={styles.top_message}>
                   <p className={styles.disscussion_avec}> {getChatUserName(currentChatUserId)}</p>
                 

                
          
                <button onClick={handleClose_message} className={styles.modal_close_btn_message} style={{ cursor: 'pointer' }}> <Image
          src='/close-button.png'
          width={150}
          height={150}
          alt="Profile Picture"
          className={styles.close_ph}
        /> </button>
                </div>
               
                
               
                {/* Afficher les messages ici */}
                <div className={styles.messagesContainer}>
  {filteredMessages.map((msg, index) => (
    <div key={index} className={`${styles.all_message_div} ${msg.senderId === userId ? styles.myMessageContainer : styles.otherMessageContainer}`}>
      {/* Afficher la photo de profil */}


      <div className={styles.profileContainer}>
        <Image
          src={getImagePath(msg.senderId === userId ? user_image : getImageUser(currentChatUserId))}
          width={40}
          height={40}
          alt="Profile Picture"
          className={styles.profilePhoto_message}
        />
      </div>

      {/* Contenu du message */}
      <div className={`${styles.message} ${msg.senderId === userId ? styles.myMessage : styles.otherMessage}`}>
        <span className={styles.senderName}>
          {msg.senderId === userId ? "Vous" : getChatUserName(currentChatUserId)}
        </span>
        <p className={styles.message_content}>{msg.content}</p>
        <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span> {/* Display timestamp */}
      </div>

    </div>
  ))}
</div>
<div className={styles.envoie_div}>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tapez votre message ici" className={styles.textarea} />
                <button onClick={sendMessage} className={styles.sendButton} style={{ cursor: 'pointer' }} >
                <Image
          src='/send.png'
          width={150}
          height={150}
          alt="Profile Picture"
          className={styles.send_ph}
        />
                </button>
                </div>

              </div>
            </div>
          )}






{ismodalMessage2 && currentChatUserId && (
  <div className={styles.modal_container_profile}>
  <div className={styles.modal_container_rec_offre}>

    <div className={styles.top_message2}>
    <button onClick={handleClose_message} className={styles.modal_close_btn_message} style={{ cursor: 'pointer' }}> ← </button>
       <p className={styles.disscussion_avec}> {getChatUserName(currentChatUserId)} </p>
       <p className={styles.role_avec}> {getChatUserrole(currentChatUserId)}</p>
       
       </div>




     {/* Afficher les messages ici */}
     <div className={styles.messagesContainer}>
  {filteredMessages.map((msg, index) => (
    <div key={index} className={`${styles.all_message_div} ${msg.senderId === userId ? styles.myMessageContainer : styles.otherMessageContainer}`}>
      {/* Afficher la photo de profil */}


      <div className={styles.profileContainer}>
        <Image
          src={getImagePath(msg.senderId === userId ? user_image : getImageUser(currentChatUserId))}
          width={40}
          height={40}
          alt="Profile Picture"
          className={styles.profilePhoto_message}
        />
         <span className={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span> {/* Display timestamp */}
      </div>

      {/* Contenu du message */}
      <div className={`${styles.message} ${msg.senderId === userId ? styles.myMessage : styles.otherMessage}`}>
        <span className={styles.senderName}>
          {msg.senderId === userId ? "Vous" : getChatUserName(currentChatUserId)}
        </span>
        <p className={styles.message_content}>{msg.content}</p>
       
      </div>
    </div>
  ))}
</div>






       <div className={styles.envoie_div}>
        <div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tapez votre message ici" className={styles.textarea} />
        </div>
            
                <button onClick={sendMessage} className={styles.sendButton} style={{ cursor: 'pointer' }} >
                Send
                </button>
                </div>




       </div>
       </div>
)}








          

          <div className={styles.div_bas2}>
            <button className={styles.deco_div} style={{ cursor: 'pointer' }} onClick={toggleLogout}>
              <Image className={styles.deco2} src={getImagePath(user_image)} width={150} height={150} alt="Logout" priority />
              <div className={styles.info_user}>
              <p>{username} {userprenom}</p>
              <p >{user_Gmail}</p>
               <div className={styles.status2}></div> 
              </div>

              {isLogoutVisible && (
        <div className={styles.logout_box}>
          <button onClick={handleLogout} className={styles.logout_button}>
           <p>
           Logout
           </p>
            
            <Image
              className={styles.deco}
              src="/logout.png"
              width={50}
              height={50}
              alt="Logout"
              priority
            />
          </button>
        </div>
      )}
              
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
