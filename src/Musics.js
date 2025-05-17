import './Musics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DBase from './MusicBase';

const Musics = (Music) =>{
    const ChangeSong=(song)=>{
        Music.setMusic(song)
    }
    const deleteSong=()=>{
        const base=new DBase()
        base.Delete(Music.name)
        Music.GetAllSongs();
    }
    //<img src='logo192.png' alt="music logo"></img>
    return(
        <div id="card">
            <div id='musicArt' style={{backgroundImage:
            Music.image===null?`url( https://daily.jstor.org/wp-content/uploads/2023/02/good_times_with_bad_music_1050x700.jpg)`:`url(${Music.image})`
            }}>
                <FontAwesomeIcon icon={faTrash} id="trash" 
                onClick={deleteSong}
                />
            </div>
            <div id="details" onClick={()=>ChangeSong(Music.name)}>
                <div id="songTitle">
                {Music.name.split('-')[0]}
                </div>
                <div id="artName">{Music.name.split('-')[1]?.trim() ? Music.name.split('-')[1] : 'Unknown'}</div>
            </div>
        </div>
    )
}

export default Musics