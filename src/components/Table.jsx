/* eslint-disable react/prop-types */

// style
import styles from "../assets/scss/table.module.scss";

export default function Table(props) {
  const { headers, body } = props;
  // console.log(props);
  return (
    <div>
      <table className={styles.fileTable}>
        <thead>
          <tr>
            {headers.map((header) => {
              return <th key={header}>{header}</th>;
            })}
          </tr>
        </thead>

        <tbody>{body()}</tbody>
      </table>
    </div>
  );
}
