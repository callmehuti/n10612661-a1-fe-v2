// node packages
import { Link, useNavigate } from "react-router-dom";

// style
import styles from "../../assets/scss/sidebar.module.scss";

// icons
import { FaUserAstronaut } from "react-icons/fa";
import { IoFolderOutline } from "react-icons/io5";
import { GoDesktopDownload } from "react-icons/go";
import { MdOutlineFileUpload } from "react-icons/md";
import { token } from "../../constant/token";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(token.ACCESS_TOKEN);
    navigate("/login");
  };

  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.user}>
          <FaUserAstronaut />
          User
        </div>
        <Link to={"/"}>
          <IoFolderOutline /> All Files
        </Link>
        <Link to={"/download-transcode"}>
          <GoDesktopDownload />
          Download & Transcode Files
        </Link>
        <Link to={"/upload"}>
          <MdOutlineFileUpload /> Uploading Files
        </Link>
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
