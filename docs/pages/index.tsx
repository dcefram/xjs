import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>XJS 3.0 (Pre-alpha)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.overlay}>
          <div className={styles.logo} />
          <div className={styles.subtitle}>
            The development framework for building awesome XSplit Broadcaster
            Plugins
          </div>
          <div className={styles.buttons}>
            <button className={styles.getStarted}>GET STARTED</button>
          </div>
        </div>
      </main>

      <footer className={styles.copyright}>© 2020 <a href="https://www.splitmedialabs.com/" target="_blank" rel="noreferrer noopener">SplitmediaLabs</a>, Ltd. All Rights Reserved.</footer>
    </div>
  );
}
