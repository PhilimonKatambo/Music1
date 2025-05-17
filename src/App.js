import './App.css';
import Musics from './Musics';
import DBase from './MusicBase';
import Player from './player';
//import GetMusic from './getMusic';
import React, { useState,useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic} from "@fortawesome/free-solid-svg-icons";
  
function App() {
  const base=new DBase();
  const[Music1,setMusic]=useState('')
  const [MusicArray,setMusics]=useState([])
  const [MusicArray2, setMusics2]=useState([])
  const [files, setFiles]=useState([]);

  const id=useRef(null)
  let i=0
  const all2=[]

  const GetAllSongs=async()=>{
    const all=await base.RetriveAll();
    all.forEach(et => {
      all2.push(et.name)
    });

    setMusics2(all2)
    await setMusics(all)
  }

  const SearchGG= async (query)=>{
    const API_KEY="AIzaSyBu91AIKPPFOMYkBS-6FC3i7aZ_-T57F6A"
    const CX="4268a945390f64a21" 

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&searchType=image&key=${API_KEY}`;

    try{

      const response = await fetch(url);

      const data= await response.json();
    if(data.items && data.items.length>0){
        let imageUrl=data.items[0].link

        return imageUrl
    }else{
        console.log('No images found')
        return null;
    }

    }catch(e){
        console.log('error12:',e)
        return null;
    }
  }

  const handleFileChange=(event)=>{
    let imageUrl=''
    const filed=event.target.files;
    const fileArray=Array.from(filed);
    setFiles(fileArray)
    for(let file2 of fileArray){

      if(MusicArray2.includes(file2.name)){
        i++;
      }else{
        const reader1=new FileReader();
        reader1.readAsDataURL(file2);
        reader1.addEventListener('load',(result)=>{

          SearchGG(file2.name.split('-')[0].split('(')[0]).then(url=>{
            imageUrl=url

            if(imageUrl!=''){
            console.log(imageUrl)
            base.SaveSong(file2.name,reader1.result,imageUrl)
            GetAllSongs();
            }
          })
      })
  }
  }

  if(i!==0){
    alert(String(i)+' songs are already imported')
  }
}

useEffect(()=>{
  GetAllSongs()
},[])
  return (
    <div id='Home'>
      <div id='upBar'> 
        <img src='logoEdt.jpg' id='logo'></img>  
        <p id='Name'>TheWarge</p>
      <label htmlFor='input'>Import some songs</label>
    <input name='inps' type='file' accept=".mp3,.wav,.flac,.ogg,.aac,.m4a" id='input' onChange={handleFileChange} multiple style={{display:'none'}}></input>
    </div>
    <div id="Songs">
      {MusicArray.length === 0 ? (
        <div id='Nosong'>
          There is no music
        </div>
      ) : (
        MusicArray.map((song, index) => (
        <Musics key={index} name={song.name} image={song.image} setMusic={setMusic} GetAllSongs={GetAllSongs}/>
        ))
      )}
    </div>
      <Player musicName={Music1} musicThing={Music1} MusicArray={MusicArray2} setMusic={setMusic}/>
    </div>
  );
}

export default App;
