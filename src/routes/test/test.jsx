import React, { useEffect } from "react";
import axios from "axios";

const Test =() => {
    async function getData(){
        console.log('hello');
        const response = await axios.get("https://api-food.dev.fd-squad.com/api/v1/rest/shops/501/categories?perPage=15&lang=en&page=1");
        const data = await response.json();
        console.log(data);
    }

   getData();

    return(
     <>
        <body>  
          <h1>Simple test file for CORS</h1>
        </body>  
     </>
       
    )  
}

export default Test;