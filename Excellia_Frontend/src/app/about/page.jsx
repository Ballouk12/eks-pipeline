import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { FaGraduationCap, FaSearch, FaFileAlt, FaCheckCircle, FaComments } from "react-icons/fa";
import Button from "@/components/Button/button";
import Img1 from "../../../public/images/campus-green.jpg";
import Img2 from "../../../public/images/ceremonygrad.jpg";
import Img3 from "../../../public/images/student-studying.jpg";
const About = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <Image
          src={Img1} // Image of campus with green elements
          fill={true}
          alt="Students on campus"
          className={styles.heroImg}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Excellia</h1>
          <h2 className={styles.heroSubtitle}>
            Your Gateway to Academic Excellence
          </h2>
        </div>
      </div>

      {/* Mission Section */}
      <div className={styles.missionContainer}>
        <div className={styles.missionContent}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            At Excellia, we streamline access to scholarships for students at all academic levels,
            from preparatory classes to doctoral studies. Our platform simplifies the application process,
            allowing students to focus on what truly matters: their academic success.
          </p>
          <Image
            src={Img2} // Image of students in graduation attire
            width={500}
            height={300}
            alt="Students celebrating academic success"
            className={styles.missionImg}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featuresContainer}>
        <h2 className={styles.sectionTitle}>How Excellia Helps You</h2>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaSearch className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Simplified Search</h3>
            <p className={styles.featureDesc}>
              Quickly find available scholarships at your institution that match your academic profile.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaFileAlt className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Digital Documents</h3>
            <p className={styles.featureDesc}>
              Upload and manage your important documents securely in one centralized location.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaCheckCircle className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Real-Time Tracking</h3>
            <p className={styles.featureDesc}>
              Monitor your application status anytime and receive notifications about their progress.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaComments className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Direct Communication</h3>
            <p className={styles.featureDesc}>
              Easily connect with scholarship administrators at your institution.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className={styles.testimonialContainer}>
        <div className={styles.testimonialOverlay}></div>
        <Image
          src={Img3}  // Image with green tones of student studying
          fill={true}
          alt="Student working in a library"
          className={styles.testimonialImg}
        />
        <div className={styles.testimonialContent}>
          <h2 className={styles.testimonialTitle}>Student Success Stories</h2>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "Excellia made finding and applying for scholarships at my university incredibly simple. 
              I was able to secure funding that allowed me to focus entirely on my studies."
            </p>
            <p className={styles.testimonialAuthor}>- BOUKHRAIS Meryem, Engineering Student</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle}>Ready to Find Your Scholarship?</h2>
        <p className={styles.ctaText}>
          Join thousands of students who have simplified their scholarship journey with Excellia.
        </p>
        <div className={styles.ctaButtons}>
          <Button url="/signup" text="Get Started" />
          <Button url="/contact" text="Contact Us" />
        </div>
      </div>
    </div>
  );
};

export default About;