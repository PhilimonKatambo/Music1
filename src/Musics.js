import './Musics.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DBase from './MusicBase';
import { useEffect, useState } from 'react';

const Musics = (props) => {
    const [image, setImage] = useState()
    const deleteSong = () => {
        const base = new DBase()
        base.Delete(props.music.name)
        props.GetAllSongs();
    }

    useEffect(() => {
        setImage(props.music.image!==null ? URL.createObjectURL(props.music.image): null);
    }, [props.music.image])

    return (
        <div id="card">
            <div id='musicArt' style={{
                backgroundImage: image !== null ? `url(${image})` : 'url("./assets/logoEdt.jpg")'
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