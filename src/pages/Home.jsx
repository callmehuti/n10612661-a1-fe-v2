// hooks
import { useEffect, useState } from "react";

// constant
import { token } from "../constant/token";
import { api } from "../constant/api";

// components
import Table from "../components/Table";

// style
import styles from "../assets/scss/table.module.scss";

export default function Home() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
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
        setFiles(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const renderBodyTable = () => {
    return files.map((file) => (
      <tr key={file._id}>
        <td className={styles.fileName}>{file.fileName}</td>
        <td>{file.username}</td>
        <td>{file.format}</td>
        <td>{file.createdAt}</td>
      </tr>
    ));
  };

  return (
    <Table
      headers={["File name", "Creator", "Date created", "Format"]}
      body={renderBodyTable}
    />
  );
}
