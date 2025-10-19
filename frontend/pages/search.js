// pages/search.js
import { useState } from 'react';
import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '../styles/Home.module.css';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container">
      <Head>
        <title>Search - GW2Style</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.messageContainer}>
          <p className={styles.comingSoon}>
            Search functionality coming soon...
          </p>
          {searchTerm && (
            <p className={styles.searchTermDisplay}>
              You searched for: &quot;{searchTerm}&quot;
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
