import React, { useState } from 'react'
//import './LoginSignup.css' 
import user_icon from './Assets/person-icon.png';
import email_icon from './Assets/email-icon.png';
import password_icon from './Assets/password-icon.png';

export const LoginSignup = () => {

   const [action,setAction] = useState("Реєстрація");

   return (
          <div className='container'>
             <div className="header">
               <div className="text">{action}</div>
               <div className="underline"></div>
             </div>
             <div className="inputs">
               {action==="Вхід"?<div></div>:
               <div className="input">
                  <img src={email_icon} alt="" /> 
                  <input placeholder="Пошта" type="email" />            
               </div>
                  }    
                                         
               <div className="input">
                  <img src={user_icon} alt="" />
                  <input  placeholder= "Логін" type="text" />            
               </div>                              
               <div className="input">
                  <img src={password_icon} alt="" />
                  <input placeholder="Пароль" type="password"/>            
               </div>
             </div>
             {action=== "Реєстрація"?<div></div>:<div>
                <div className="forgot-password">Забули пароль? <span>Тисніть сюди!</span></div>
             </div>}  
                <div className="submit-container">           
                <div className={`submit ${action === "Вхід" ? "gray" : ""}`} onClick={() => setAction("Реєстрація")}>
                Реєстрація
                </div>
                <div className={`submit ${action === "Реєстрація" ? "gray" : ""}`} onClick={() => setAction("Вхід")}>
                Вхід
                </div>
             </div>
          </div>
  );
};

export default LoginSignup;
