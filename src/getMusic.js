import React, { useState } from "react"

const GetMusic=()=>{
 const [files, setFiles]=useState([]);

 const handleFileChange=(event)=>{
    const filed=event.target.files;
    const fileArray=Array.from(filed);
    setFiles(fileArray)

    for(let file of fileArray){
        console.log(file)
    }
 }

}
export default GetMusic