import Image from "next/image";
import styles from "./page.module.css";
import Button from "@/components/Button/button";
import Hero from "../../public/images/logoExcelia.png";

export default function Home() {
  return (
    
       <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
        🌟Welcome to ExcelliaBourse! 
        </h1>
        <p className={styles.desc}>
        A seamless scholarship management platform that simplifies applications, automates processing, and ensures fair selection. Powered by DevOps, cloud, and AI, Excellia offers a secure, scalable, and user-friendly experience for students and administrators. 🚀
        </p>
        <Button url="/about" text="About Us"/>
      </div>
      <div className={styles.item}>
        <Image src={Hero} alt="" className={styles.image} />
      </div>
    </div>
    
  );
}
