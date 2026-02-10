import React from 'react';  


function Nav({setVista }) {  
    return (  
        <nav>  
           <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            
           </ul>
        </nav>  
    );  
}  


export default Nav; 