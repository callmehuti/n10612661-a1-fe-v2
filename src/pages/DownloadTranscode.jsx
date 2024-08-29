// hooks
import { useEffect, useState } from "react";
import axios from "axios";

// constant
import { token } from "../constant/token";
import { api } from "../constant/api";

// components
import Table from "../components/Table";

// style
import styles from "../assets/scss/table.module.scss";

// icons
import { MdDownload } from "react-icons/md";
import { MdDownloadDone } from "react-icons/md";
import { MdErrorOutline } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import Modal from "../components/Modal";

import { socket } from "../connect/socket";

export default function DownloadTranscode() {
  const [files, setFiles] = useState([]);
  const [chosenQuality, setChosenQuality] = useState([]);
  const [popUpFlag, setPopUpFlag] = useState("");
  const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);
  const [downloadPopupFlag, setDownLoadPopupFlag] = useState(false);

  const progressStatus = {
    select: "select",
    processing: "processing",
    done: "done",
    error: "error",
  };

  const fileQualities = ["240p", "360p", "480p", "720p", "1080p", "2k"];

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem(token.ACCESS_TOKEN);
      const res = await fetch(api.getAllFiles(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      // console.log(data);
      const items = data.map((file) => ({
        ...file,
        progress: 0,
        downloadStatus: progressStatus.select,
        transcodeStatus: progressStatus.select,
      }));
      setFiles(items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const connect = () => {};
    const disconnect = () => {};

    const onTranscodeProgress = (data) => {
      console.log(files);
      console.log(data);
      const fileIndex = files.findIndex(
        (file) => file.fileName === data.fileName
      );

      // no file found in state
      if (fileIndex !== -1) {
        const updateFiles = [...files];
        const file = updateFiles[fileIndex];

        file.transcodeStatus = progressStatus.processing;
        file.progress = data.percent;

        if (data.percent === 100) {
          file.transcodeStatus = progressStatus.done;
        }

        setFiles(updateFiles);
      }
    };

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("progress", onTranscodeProgress);

    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("progress", onTranscodeProgress);
    };
  }, [files]);

  const onDownloadFile = async (quality) => {
    // console.log(fileName);
    const { file, index } = selectedDownloadFile;
    const item = files[index];
    item.downloadStatus = progressStatus.processing;
    setFiles([...files]);
    const accessToken = localStorage.getItem(token.ACCESS_TOKEN);
    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      // handleDownloadFile key = filename-quality [filename-240p]
      // filename.mp4
      const fileName = file.fileName.split(".")[0];
      setDownLoadPopupFlag(false);
      await axios.get(api.handleDownloadFile(fileName, quality), headers);

      const res = await axios.get(api.downloadFile(fileName, quality), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
        onDownloadProgress: (progress) => {
          // console.log(progress.total);
          // console.log(progress.loaded);
          const progressPercent = Math.round(
            (progress.loaded / progress.total) * 100
          );
          item.progress = progressPercent;
          setFiles([...files]);
        },
      });

      // create file link in browser's memory
      const href = URL.createObjectURL(new Blob([res.data]));
      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", `${fileName}-${quality}.mp4`); //or any other extension
      document.body.appendChild(link);
      link.click();

      // download status => done
      item.downloadStatus = progressStatus.done;
      setFiles([...files]);
    } catch (error) {
      console.log(error);
      item.downloadStatus = progressStatus.error;
      setFiles([...files]);
    }
  };

  const onSelectQualities = (fileQuality) => {
    if (chosenQuality.includes(fileQuality)) {
      const arr = chosenQuality.filter((item) => item !== fileQuality);
      setChosenQuality(arr);
      return;
    }
    setChosenQuality([...chosenQuality, fileQuality]);
  };

  const onTranscodeFile = (file, index) => {
    setPopUpFlag(file.fileName);
    // add index here
    setSelectedDownloadFile({ file, index });
  };

  const renderDownloadStatus = (item) => {
    let result = "";
    switch (item.downloadStatus) {
      case progressStatus.select:
        result = <MdDownload />;
        break;
      case progressStatus.processing:
        result = (
          <div className={styles.processBar}>
            <div
              className={styles.progressPercent}
              style={{
                width: `${item.progress}%`,
              }}
            ></div>
          </div>
        );
        break;
      case progressStatus.done:
        result = <MdDownloadDone />;
        break;
      case progressStatus.error:
        result = <MdErrorOutline />;
        break;
      default:
        break;
    }
    return result;
  };

  const renderTranscodeStatus = (file, index) => {
    let result = "";
    switch (file.transcodeStatus) {
      case progressStatus.select:
        result = (
          <span
            onClick={() => onTranscodeFile(file, index)}
            style={{ padding: "1rem" }}
          >
            <SiConvertio />
          </span>
        );
        break;
      case progressStatus.processing:
        result = (
          <div className={styles.processBar}>
            <div
              className={styles.progressPercent}
              style={{
                width: `${file.progress}%`,
              }}
            ></div>
          </div>
        );
        break;
      case progressStatus.done:
        result = <MdDownloadDone />;
        break;
      case progressStatus.error:
        result = <MdErrorOutline />;
        break;
      default:
        break;
    }
    return result;
  };

  const renderBodyTable = () => {
    return files.map((file, index) => (
      <tr key={file._id}>
        <td className={styles.fileName}>{file.fileName}</td>
        <td>{file.username}</td>
        <td>
          <div className={styles.actionContainer}>
            <span
              onClick={() => {
                setSelectedDownloadFile({ file, index });
                setDownLoadPopupFlag(true);
              }}
              style={{ marginRight: "3rem", padding: "1rem" }}
            >
              {renderDownloadStatus(file, index)}
            </span>
            <span
              onClick={() => onTranscodeFile(file, index)}
              style={{ padding: "1rem" }}
            >
              {renderTranscodeStatus(file, index)}
            </span>
          </div>
        </td>
      </tr>
    ));
  };

  const onSubmitQualities = async () => {
    if (!chosenQuality.length) return;

    setPopUpFlag("");
    setChosenQuality([]);

    const accessToken = localStorage.getItem(token.ACCESS_TOKEN);
    const qualitiesParams = chosenQuality.join(",");

    const { index } = selectedDownloadFile;
    const item = files[index];

    if (!item) {
      console.log("Item is not found for index ", index);
      return;
    }
    item.transcodeStatus = progressStatus.processing;
    setFiles([...files]);

    try {
      const res = await axios.get(
        // popupFlag
        api.generateFile(popUpFlag, qualitiesParams),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchData();
      console.log(res);
    } catch (error) {
      console.log("Error while generating file: ", error);
      item.transcodeStatus = progressStatus.error;
      setFiles([...files]);
    }
  };

  console.log(files);
  console.log(chosenQuality);
  console.log(selectedDownloadFile);

  return (
    <>
      <Table
        headers={["File name", "Creator", "Action"]}
        body={renderBodyTable}
      />
      <Modal
        qualities={
          selectedDownloadFile?.file &&
          fileQualities.filter(
            (quality) => !selectedDownloadFile.file.qualities.includes(quality)
          )
        }
        onSelectQuality={onSelectQualities}
        chosenQuality={chosenQuality}
        isActivePopup={popUpFlag}
        setIsActivePopup={setPopUpFlag}
        isSubmit={true}
        onSubmit={onSubmitQualities}
      />

      <Modal
        qualities={selectedDownloadFile?.file?.qualities || []}
        onSelectQuality={onDownloadFile}
        chosenQuality={[]}
        isActivePopup={downloadPopupFlag}
        setIsActivePopup={setDownLoadPopupFlag}
        isSubmit={false}
        onSubmit={() => {}}
      />
    </>
  );
}
