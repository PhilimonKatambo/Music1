import './Musics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DBase from './MusicBase';

const Musics = (props) => {

    const deleteSong = () => {
        const base = new DBase()
        base.Delete(props.music.name)
        props.GetAllSongs();
    }
    //<img src='logo192.png' alt="music logo"></img>
    return (
        <div id="card">
            <div id='musicArt' style={{
                backgroundImage:
                    props.music.image === null ? `url( https://daily.jstor.org/wp-content/uploads/2023/02/good_times_with_bad_music_1050x700.jpg)` : `url(${props.music.image})`
            }}>
                <FontAwesomeIcon icon={faTrash} id="trash"
                    onClick={deleteSong}
                />
            </div>
            <div id="details" onClick={() => props.setMusic(props.music)}>
                <div id="songTitle">
                    {props.music.name.split('-')[0]}
                </div>
                <div id="artName">{props.music.name.split('-')[1]?.trim() ? props.music.name.split('-')[1] : 'Unknown'}</div>
            </div>
        </div>
    )
}

export default Musics