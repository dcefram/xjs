import React from 'react';
import cx from 'classnames';
import Head from 'next/head';

import Nav from './nav';

interface IProps {
  children: React.ReactNode;
  landing: boolean;
}

export default function Layout({ children, landing }: IProps) {
  return (
    <div className={landing ? 'landing' : ''}>
      <Head>
        <title>XJS 3.0 (Pre-alpha)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav
        links={[
          { label: 'Home', href: '/' },
          { label: 'Quick Start', href: '/quick-start' },
          { label: 'Docs', href: '/docs' },
        ]}
      />

      <main className={landing ? 'center' : ''}>
        {children}
      </main>

      <footer>
        © 2020{' '}
        <a
          href="https://www.splitmedialabs.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          SplitmediaLabs
        </a>
        , Ltd. All Rights Reserved.
      </footer>

      <style jsx>{`
        .landing {
          background-image: url(/squares.jpg);
          background-size: cover;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .center {
          display: flex;
          align-items: center;
        }

        main {
          flex: 1;
          width: 100%;
        }

        footer {
          color: #518CCF;
          font-size: 14px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
