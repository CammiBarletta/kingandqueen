import React from 'react';  
import CarritoTotal from "./CarritoTotal"

function Main({vista}) {  
    return (  
        <main style={{ padding: "20px" }}> 
        {vista === "home" && <h1>Home </h1>} 
        {vista === "productos" && <h1> Productos </h1>} 
        {vista === "home" && <CarritoTotal />} 
    
        </main>  
    );  
}  
export default Main;  