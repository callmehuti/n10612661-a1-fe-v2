// hooks
import { useRef, useState } from "react";

// node packages
import axios from "axios";

// constant
import { api } from "../constant/api";
import { token } from "../constant/token";

//style
import styles from "../assets/scss/upload.module.scss";

// icons
import { LuFilePlus2 } from "react-icons/lu";
import { MdOutlinePlayCircle } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import { MdDownloadDone } from "react-icons/md";
import { MdErrorOutline } from "react-icons/md";

export default function Upload() {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);

  // "select" || "upload" || "done"
  const uploadStatus = {
    select: "select",
    processing: "processing",
    done: "done",
    error: "error",
  };

  const handleFileChange = (e) => {
    console.log(Object.values(e.target.files));
    const moreFile = Object.values(e.target.files);
    moreFile.forEach((file) => {
      setFiles((prev) => [
        ...prev,
        {
          file,
          uploadStatus: uploadStatus.select,
          progress: 0,
        },
      ]);
    });
    // const file = e.target.files[0];
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const onClearFile = (index) => {
    const arr = files.filter((item, pos) => pos !== index);
    setFiles(arr);
  };

  const onUploadFile = async (index) => {
    console.log(index);
    const item = files[index];
    item.uploadStatus = uploadStatus.processing;
    const formData = new FormData();
    formData.append("file", item.file);

    try {
      const res = await axios.post(api.uploadFile(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem(token.ACCESS_TOKEN)}`,
        },
        onUploadProgress: (progress) => {
          // console.log(progress.loaded, progress.total);
          const progressPercent = Math.round(
            (progress.loaded / progress.total) * 100
          );
          // console.log(progressPercent);
          // setProgress(() => progressPercent);
          item.progress = progressPercent;
          setFiles([...files]);
        },
      });
      item.uploadStatus = uploadStatus.done;
      setFiles([...files]);
      console.log(res);
    } catch (error) {
      console.log(error);
      item.uploadStatus = uploadStatus.error;
      setFiles([...files]);
    }
  };

  const renderStatus = (item, index) => {
    let result = "";
    switch (item.uploadStatus) {
      case uploadStatus.select:
        result = (
          <button className={styles.btn} onClick={() => onUploadFile(index)}>
            upload
          </button>
        );
        break;
      case uploadStatus.processing:
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
      case uploadStatus.done:
        result = <MdDownloadDone />;
        break;
      case uploadStatus.error:
        result = <MdErrorOutline />;
        break;
      default:
        break;
    }
    return result;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className={styles.uploadContainer}>
      {/* <div> */}
      {/* <label htmlFor="file">Choose file to upload</label> */}
      <input
        ref={inputRef}
        type="file"
        id="file"
        name="file"
        multiple
        onChange={handleFileChange}
        // style={{ display: "none" }}
        hidden
      />
      {/* </div> */}

      {!files.length ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <button className={styles.fileBtn} onClick={onChooseFile}>
              <LuFilePlus2 />
              Upload File
            </button>
            <p className={styles.fileDesc}>Format supports mp4,mov,mkv,avi.</p>
          </div>
        </div>
      ) : null}

      {/* Display file information and progress when there is a selected file*/}
      {files.length ? (
        <>
          {files.map((item, index) => {
            return (
              <>
                <div className={styles.fileCard} key={`${index}file`}>
                  {/* Display file name, progress bar and so on */}
                  <div
                    className={`${styles.fileInfo} ${
                      item?.uploadStatus === uploadStatus.error
                        ? styles.error
                        : null
                    }`}
                  >
                    <div className={styles.fileName}>
                      <MdOutlinePlayCircle />
                      <p>{item?.file?.name}</p>
                    </div>
                    <div className={styles.right}>
                      <span>{formatBytes(item?.file?.size)}</span>
                      <div>
                        {/* {item?.uploadStatus === uploadStatus.processing ? (
                          <div
                            className={styles.processBar}
                            // style={{ width: `${item?.progress}%` }}
                          >
                            <div
                              className={styles.progressPercent}
                              style={{
                                width: `${item.progress}%`,
                              }}
                            ></div>
                          </div>
                        ) : null} */}
                        {/* {item?.uploadStatus === uploadStatus.select ? (
                          <button
                            className={styles.btn}
                            onClick={() => onUploadFile(index)}
                          >
                            upload
                          </button>
                        ) : null}
                        {item.uploadStatus === uploadStatus.done ? (
                          <MdDownloadDone />
                        ) : null}
                        {item.uploadStatus === uploadStatus.error ? (
                          <MdErrorOutline />
                        ) : null} */}

                        {renderStatus(item, index)}
                      </div>
                      {/* Display clear button or upload progress/checkmark */}
                      <div>
                        {item.uploadStatus === uploadStatus.select ? (
                          <button
                            className={styles.closeBtn}
                            onClick={() => onClearFile(index)}
                          >
                            <TiDeleteOutline />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
          <div className={styles.uploadBtn}>
            <button className={styles.btn} onClick={onChooseFile}>
              Add more
            </button>
          </div>
        </>
      ) : null}

      {/* <div>
        <p>Uploading: {progress}%</p>
      </div> */}

      {/* Finalize upload or clear selection */}
      {/* <div>
        <button
          onClick={onUploadFile}
          style={{
            pointerEvents: file ? "initial" : "none",
            opacity: file ? 1 : 0.5,
          }}
        >
          Upload
        </button>
      </div> */}
    </div>
  );
}
