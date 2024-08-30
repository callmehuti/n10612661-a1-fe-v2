// hooks
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// node packages
import Hls from "hls.js";
import axios from "axios";

// constant
import { api } from "../constant/api";
import { token } from "../constant/token";

// style
import styles from "../assets/scss/videoPlayer.module.scss";

const VideoPlayer = () => {
  const { file } = useParams();
  const videoRef = useRef(null);
  const [hlsInstance, setHlsInstance] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currLevel, setCurrLevel] = useState(-1);

  useEffect(() => {
    const fileName = file && file.split(".")[0];
    const username = localStorage.getItem("username");
    const masterPlaylistUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/file/stream?file=${fileName}.m3u8&folder=${fileName}&username=${username}`;

    const fetchInfo = async () => {
      try {
        const accessToken = localStorage.getItem(token.ACCESS_TOKEN);

        const res = await axios.get(api.getFileInfo(file), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res?.data?.relativeInfo.length) return;
        const keywords = res.data.relativeInfo;
        const randomKeyword =
          keywords[Math.floor(Math.random() * keywords.length)];
        console.log(randomKeyword);
        const searchResult = await axios.get(
          api.getRelativeVideos(randomKeyword),
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            },
          }
        );
        // Display only 4 relative video
        setRelative(
          searchResult.data.result.items.filter((_, index) => index < 4)
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchInfo();
    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(masterPlaylistUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        setHlsInstance(hls);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error encountered:", data);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error encountered:", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error encountered:", data);
              hls.destroy();
              break;
          }
        } else {
          console.warn("Non-fatal error encountered:", data);
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = masterPlaylistUrl;
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [file]);

  const [relative, setRelative] = useState([]);

  console.log(relative);

  const handleQualityChange = (level) => {
    if (hlsInstance) {
      hlsInstance.currentLevel = level;
    }
  };

  return (
    <div style={{ overflowY: "auto", height: "89vh" }}>
      <div>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls
          autoPlay
          preload="auto"
        />
        {levels.length > 0 && (
          <div className={styles.selectQualityContainer}>
            <p style={{ marginRight: "5px" }}>Choose quality:</p>
            <div className={styles.select}>
              <select
                onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                value={currLevel}
              >
                <option value={-1}>Auto</option>
                {levels.map((level, index) => (
                  <option key={index} value={index}>
                    {level.height}p
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      <div className={styles.relativeVideoContainer}>
        {relative.length ? (
          relative.map((item, index) => {
            return (
              <a
                href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                target="__blank"
                key={index}
              >
                <img src={item.snippet.thumbnails.high.url} />
                <h3>{item.snippet.title}</h3>
              </a>
            );
          })
        ) : (
          <p>
            No related videos yet. Add more information to find related videos.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
