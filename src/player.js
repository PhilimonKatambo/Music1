import './player.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward,faPlay,faPause } from "@fortawesome/free-solid-svg-icons";
import React, { useState,useRef, useEffect} from "react"
import DBase from './MusicBase';

const Player = (Music) => {
    const [progressbar, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [name3,setName3]=useState('')
    const audioRef = useRef(null);

    const togglePlayPause = () => {

        if (audioRef.current.paused) {
            const playPromise=audioRef.current.play()
            if(playPromise!==undefined){
                
                playPromise
                .then(()=>setIsPlaying(true))
                .catch(error=>{
                    console.log(error) 
                    //alert('You gotta select a song to play!')
                })
        }
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }

    };

    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === "Space") {
                togglePlayPause()
                event.preventDefault(); 
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const Next=()=>{
        const newSong=Music.MusicArray.indexOf(name3)
        console.log(name3)
        console.log(newSong)
        if(newSong!==Music.MusicArray.length-1){
        Music.setMusic(Music.MusicArray[newSong+1])
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        setDuration(0)
        retriveSongs();
        }
        else{
            alert("can't play the next song!")
        }
    }

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener("timeupdate", updateProgress);
            //audio.addEventListener("ended",cosn)
            return () => {

                audio.removeEventListener("timeupdate", updateProgress);
            };
        }
    }, []);

    const retriveSongs = async ()=>{
        const base= await new DBase();
        let song1=[];
        song1= await base.Retrive(Music.musicName);
        setName3(song1?song1[0]:'')
        audioRef.current.src=song1?song1[1]:'unknown'
        if(audioRef.current.onLoadedMetadata=() => setDuration(audioRef.current.duration)){
        togglePlayPause();
        }
    }

    useEffect(()=>{
       retriveSongs()
    },[Music.musicThing])

    const ChangeMusicTime = (event) => {
        if (audioRef.current && audioRef.current.duration) {
            const newTime = (event.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(event.target.value);
        }
    };

    const Prev=()=>{
        const newSong=Music.MusicArray.indexOf(name3)
        if(newSong>=0){
        Music.setMusic(Music.MusicArray[newSong-1])
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        setDuration(0)
        retriveSongs();
        }
        else{
            Music.setMusic(Music.MusicArray[0])
            setIsPlaying(false)
            setProgress(0)
            setProgress(0)
            setCurrentTime(0)
            setDuration(0)
            retriveSongs();
            alert("Can't play previous song!")
        }
    }

    return (
        <div id="player">
            <audio
                ref={audioRef}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                style={{display:'none'}}
                ></audio>
            <div id='MusicShow'>{name3}</div>
            <div id="controls">
                <button id="pre">
                    <FontAwesomeIcon icon={faBackward} id="back" onClick={Prev}/>
                </button>

                <div id="progress">
                    
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step='any'
                    value={progressbar} 
                    onChange={ChangeMusicTime} 

                />

                    <div id="info">
                        <div id="duration">{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</div>
                        <div id="plate">
                            <FontAwesomeIcon
                                icon={isPlaying ? faPause : faPlay}
                                id="plate2"
                                onClick={togglePlayPause}
                            />
                        </div>
                        <div id="date">{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}</div>
                    </div>
                </div>

                <button id="next" onClick={Next}>
                    <FontAwesomeIcon icon={faForward} id="forward" />
                </button>
            </div>
        </div>
    );
};

export default Player;
