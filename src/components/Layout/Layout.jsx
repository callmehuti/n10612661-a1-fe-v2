// node packages
import { Outlet } from "react-router-dom";

// components
import Sidebar from "./Sidebar";
import Header from "./Header";

// style
import styles from "../../assets/scss/layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.sideBar}>
        {" "}
        <Sidebar />
      </div>
      <div className={styles.contentContainer}>
        <Header />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
