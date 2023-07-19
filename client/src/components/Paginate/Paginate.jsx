import { useDispatch } from "react-redux";
import { nextPage, prevPage } from '../../Redux/actions';
import styles from './Paginate.module.css'

const Paginate = ({cantPages,numPage}) => {
    
    const dispatch = useDispatch();

    function next() {
        dispatch(nextPage());
        }
    function prev() {
        dispatch(prevPage());
        }

        return (
            <div className={styles.paginationContainer}>
              {numPage > 1 && (
                <>
                  <button className={styles.pageButton} onClick={prev}>
                    PREV
                  </button>
                  <div className={`${styles.pageNumber} ${numPage === 1 ? styles.currentPageNumber : ''}`}>
                    {numPage - 1}
                  </div>
                </>
              )}
        
              <div className={`${styles.pageNumber} ${styles.currentPageNumber}`}>
                {numPage}
              </div>
        
              {numPage < cantPages && (
                <>
                  <div className={styles.pageNumber}>
                    {numPage + 1}
                  </div>
                  <button className={styles.pageButton} onClick={next}>
                    NEXT
                  </button>
                </>
              )}
            </div>
          );
}

export default Paginate