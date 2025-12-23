import './player.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from "react"
import DBase from './MusicBase';

const Player = (props) => {
    const [progressbar, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [name3, setName3] = useState('')
    const audioRef = useRef(null);

    const togglePlayPause = () => {

        if (audioRef.current.paused) {
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {

                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(error => {
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

    const Next = () => {
        const newSong = props.MusicArray.indexOf(props.music)
        if (newSong !== props.MusicArray.length - 1) {
            setIsPlaying(false)
            setProgress(0)
            setCurrentTime(0)
            setDuration(0)
            props.setMusic(props.MusicArray[newSong + 1])
        }
        else {
            setIsPlaying(false)
            setProgress(0)
            setCurrentTime(0)
            setDuration(0)
            props.setMusic(props.MusicArray[0])
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
            return () => {

                audio.removeEventListener("timeupdate", updateProgress);
            };
        }

    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener("ended", Next);

        return () => {
            audio.removeEventListener("ended", Next);
        };
    }, [props.music]);

    useEffect(() => {
        audioRef.current.src = props.music?.value
        if (audioRef.current.onLoadedMetadata = () => setDuration(audioRef.current.duration)) {
            togglePlayPause();
        }
    }, [props.music])

    const ChangeMusicTime = (event) => {
        if (audioRef.current && audioRef.current.duration) {
            const newTime = (event.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(event.target.value);
        }
    };

    const Prev = () => {
        const newSong = props.MusicArray.indexOf(props.music)
        if (newSong >= 0) {
            props.setMusic(props.MusicArray[newSong - 1])
            setIsPlaying(false)
            setProgress(0)
            setCurrentTime(0)
            setDuration(0)
        }
        else {
            props.setMusic(props.MusicArray[props.MusicArray.length -1 ])
            setIsPlaying(false)
            setProgress(0)
            setProgress(0)
            setCurrentTime(0)
            setDuration(0)
            alert("Can't play previous song!")
        }
    }

    return (
        <div id="player">
            <audio
                ref={audioRef}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                style={{ display: 'none' }}
            ></audio>
            <div id='MusicShow'>{props.music?.name}</div>
            <div id="controls">
                <button id="pre">
                    <FontAwesomeIcon icon={faBackward} id="back" onClick={Prev} />
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
