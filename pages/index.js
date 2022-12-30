import Head from 'next/head'
import styles from '../styles/Home.module.css' 
import Header from "../components/ManualHeader"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="Smart contract raffle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      Hello World
    </div>
  )
}
