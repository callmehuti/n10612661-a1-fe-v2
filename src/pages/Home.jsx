import { Link } from "react-router-dom";

// hooks
import { useEffect, useState } from "react";

// constant
import { token } from "../constant/token";
import { api } from "../constant/api";

// package
import axios from "axios";

// components
import Table from "../components/Table";

// style
import styles from "../assets/scss/table.module.scss";

// icons
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";

export default function Home() {
  const [files, setFiles] = useState([]);

  const status = {
    edit: "edit",
    add: "add",
  };

  const [infoStatus, setInfoStatus] = useState({
    status: false,
    pos: null,
  });
  // Searching info
  const [info, setInfo] = useState("");
  const [prevInfo, setPrevInfo] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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
      setFiles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteFile = async (fileName) => {
    try {
      const accessToken = localStorage.getItem(token.ACCESS_TOKEN);

      await axios.delete(api.deleteFile(fileName), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const onPressEnter = async (event, file) => {
    if (event.key !== "Enter") return;
    setInfo("");
    setInfoStatus({
      status: false,
      pos: null,
    });
    if (!info) return;
    const accessToken = localStorage.getItem(token.ACCESS_TOKEN);
    if (infoStatus.status === status.add) {
      const body = { fileName: file.fileName, info };
      await axios.post(api.addRelativeInfo(), body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchData();
      return;
    }

    const allInfo = file.relativeInfo.filter((info) => info !== prevInfo);
    const body = { fileName: file.fileName, data: [...allInfo, info] };
    await axios.put(api.editRelativeInfo(), body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    fetchData();
  };

  const removeRelativeInfo = async (file, info) => {
    const data = file.relativeInfo.filter((item) => item !== info);
    const body = { fileName: file.fileName, data };
    const accessToken = localStorage.getItem(token.ACCESS_TOKEN);
    await axios.put(api.editRelativeInfo(), body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    fetchData();
  };

  const renderRelativeInfo = (file, pos) => {
    if (!infoStatus.status || infoStatus.pos !== pos) {
      return file.relativeInfo.map((item, index) => (
        <div key={index} className={styles.findInfoContainer}>
          <span
            onClick={() => {
              setInfoStatus({ status: status.edit, pos });
              setInfo(item);
              setPrevInfo(item);
            }}
          >
            {item}
          </span>
          <span onClick={() => removeRelativeInfo(file, item)}>
            <IoClose />
          </span>
        </div>
      ));
    }
    if (infoStatus.pos === pos) {
      return (
        <input
          type="text"
          placeholder="Input more info"
          value={info}
          style={{ padding: "1rem" }}
          onChange={(e) => setInfo(e.target.value)}
          onKeyDown={(e) => onPressEnter(e, file)}
        />
      );
    }
  };

  const renderBodyTable = () => {
    return files.map((file, index) => (
      <tr key={file._id}>
        <td className={styles.fileName}>
          {file.qualities.length ? (
            <Link to={`/watch/${file.fileName}`}>{file.fileName}</Link>
          ) : (
            file.fileName
          )}
        </td>
        <td>{file.username}</td>
        <td>{file.createdAt}</td>
        <td>
          <div className={styles.relativeInfo}>
            {renderRelativeInfo(file, index)}
            <span
              onClick={() => setInfoStatus({ status: status.add, pos: index })}
            >
              <FaPlusCircle />
            </span>
          </div>
        </td>
        {/* Action */}
        <td>
          <div className={styles.actionsContainer}>
            {file.qualities.length ? (
              <span>
                <Link to={`/watch/${file.fileName}`}>
                  <FaEye />
                </Link>
              </span>
            ) : null}
            <span onClick={() => onDeleteFile(file.fileName)}>
              <IoClose />
            </span>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Table
      headers={[
        "File name",
        "Creator",
        "Date created",
        "Relative Info",
        "Action",
      ]}
      body={renderBodyTable}
    />
  );
}
