// node packages
import { useLocation } from "react-router-dom";

// style
import styles from "../../assets/scss/header.module.scss";

export default function Header() {
  const { pathname } = useLocation();
  const paths = pathname.split("/")[1];
  const headerName = paths;

  // console.log(headerName);

  const headerNameObj = {
    "download-transcode": "Download & Transcode Files",
    upload: "Upload Files",
  };

  return (
    <div className={styles.headerContainer}>
      {headerNameObj[headerName] || "All Files"}
      {headerNameObj.upload1}
    </div>
  );
}
