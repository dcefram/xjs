import Layout from 'components/layout';

import styles from 'styles/Home.module.css';

export default function Home() {
  return (
    <Layout landing>
      <div className={styles.main}>
        <div className={styles.overlay}>
          <div className={styles.logo} />
          <div className={styles.subtitle}>
            The development framework for building awesome XSplit Broadcaster
            Plugins
          </div>
          <div className={styles.buttons}>
            <button className={styles.getStarted}>GET STARTED WITH 3.0</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
