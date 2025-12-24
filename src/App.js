import './App.css';
import Musics from './Musics';
import DBase from './MusicBase';
import Player from './player';
//import GetMusic from './getMusic';
import React, { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import jsmediatags from "jsmediatags/dist/jsmediatags.min.js";

function App() {
  const base = new DBase();
  const [Music1, setMusic] = useState({})
  const [MusicArray, setMusicsArray] = useState([])
  const [MusicArray2, setMusicsArray2] = useState([])
  const [files, setFiles] = useState([]);

  const id = useRef(null)
  let i = 0
  const all2 = []

  const GetAllSongs = async () => {
    const all = await base.RetriveAll();
    setMusicsArray(all)
  }

  // hide
  const SearchGG = async (query) => {
    const API_KEY = "AIzaSyBu91AIKPPFOMYkBS-6FC3i7aZ_-T57F6A"
    const CX = "4268a945390f64a21"

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${CX}&searchType=image&key=${API_KEY}`;

    // const url = `https://www.googleapis.com/customsearch/v1?q=${query} -site:facebook.com -site:instagram.com -site:tiktok.com -site:tiktokcdn.com&cx=${CX}&searchType=image&key=${API_KEY}`;
    try {

      const response = await fetch(url);

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        let imageUrl = data.items[0].link

        return imageUrl
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  const readThumb = (file) => {
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess: ({ tags }) => {
          if (tags.picture) {
            const { data, format } = tags.picture;
            const byteArray = new Uint8Array(data);
            const blob = new Blob([byteArray], { type: format });
            resolve(blob);
          } else {
            resolve(null);
          }
        },
        onError: reject,
      });
    });
  };


  const handleFileChange = async (event) => {
    let imageUrl = ''
    const filed = event.target.files;

    const fileArray = Array.from(filed);
    setFiles(fileArray)
    for (let file2 of fileArray) {

      if (MusicArray2.includes(file2.name)) {
        i++;
      } else {
        const reader1 = new FileReader();
        reader1.readAsDataURL(file2);
        reader1.addEventListener('load', async (result) => {

          const imageBlob = await readThumb(file2)
          base.SaveSong(file2.name, reader1.result, imageBlob)
          GetAllSongs();
        })
      }
    }

    if (i !== 0) {
      alert(String(i) + ' songs are already imported')
    }
  }

  useEffect(() => {
    GetAllSongs()
  }, [])
  return (
    <div id='Home'>
      <div id='upBar'>
        <img src='./assets/logoEdt.jpg' id='logo'></img>
        <p id='Name'>TheWarge</p>
        <label htmlFor='input'>Import some songs</label>
        <input name='inps' type='file' accept=".mp3,.wav,.flac,.ogg,.aac,.m4a" id='input' onChange={handleFileChange} multiple style={{ display: 'none' }}></input>
      </div>
      <div id="Songs">
        {MusicArray.length === 0 ? (
          <div id='Nosong'>
            There is no music
          </div>
        ) : (
          MusicArray.map((song, index) => (
            <Musics key={index} music={song} setMusic={setMusic} GetAllSongs={GetAllSongs} />
          ))
        )}
      </div>
      <Player music={Music1} MusicArray={MusicArray} setMusic={setMusic} />
    </div>
  );
}


// SearchGG(file2.name.split('-')[0].split('(')[0]).then(url => {
//   imageUrl = url

//   if (imageUrl !== null) {
//     console.log(imageUrl)
//     base.SaveSong(file2.name, reader1.result, readThumb())
//     GetAllSongs();
//   } else {
//     console.log(imageUrl)
//     base.SaveSong(file2.name, reader1.result, "https://tse1.mm.bing.net/th/id/OIP.W4yeK-ZFGSGLrOvOvQ-1xQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3")
//     GetAllSongs();
//   }
// })


export default App;
