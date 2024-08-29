/* eslint-disable react/prop-types */
// icon
import { IoIosCloseCircle } from "react-icons/io";

// styles
import styles from "../assets/scss/downloadTranscode.module.scss";

function Modal(props) {
  const {
    qualities,
    onSelectQuality,
    chosenQuality,
    isActivePopup,
    setIsActivePopup,
    isSubmit,
    onSubmit,
  } = props;
  return (
    <>
      {isActivePopup ? (
        <div className={styles.popupContainer}>
          <div className={styles.content}>
            {/* Close popup */}
            <IoIosCloseCircle
              className={styles.closeIcon}
              onClick={() => setIsActivePopup(false)}
            />

            {/* Qualities container */}
            <div className={styles.qualitiesContainer}>
              {qualities.map((fileQuality, index) => {
                return (
                  <span
                    onClick={() => onSelectQuality(fileQuality)}
                    className={`${styles.btn} ${
                      // eslint-disable-next-line react/prop-types
                      chosenQuality.includes(fileQuality) ? styles.active : ""
                    }`}
                    key={`${fileQuality}-${index}`}
                  >
                    {fileQuality}
                  </span>
                );
              })}
            </div>

            {/* Submit selected qualities */}
            {isSubmit ? (
              <button className={styles.submitBtn} onClick={onSubmit}>
                Submit
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;
