import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import 'firebase/auth';
import ToDoItems from '../components/ToDoItems'; // Import your ToDoItems component here
import Events from '../components/Events'; // Import your Events component here
import Contacts from '../components/Contacts'; // Import your Contacts component here

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Your App Title</title>
        <meta name="description" content="Your app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Your App</h1>

        <div className={styles.grid}>
          <ToDoItems /> {/* Render your ToDoItems component */}
          <Events /> {/* Render your Events component */}
          <Contacts /> {/* Render your Contacts component */}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="/__repl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built on
          <span className={styles.logo}>
            <Image src="/replit.svg" alt="Replit Logo" width={20} height={18} />
          </span>
          Replit
        </a>
      </footer>
    </div>
  );
};

export default Home;
