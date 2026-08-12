import ImageSlot from "./ImageSlot";
import styles from "./About.module.css";

const stats = [
  { value: "98%", label: "Satisfaction rate" },
  { value: "10+", label: "Years of experience" },
  { value: "5.0", label: "Google rating" },
];

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.grid}>
          <div>
            <span className="eyebrow eyebrowOnDark">About us</span>
            <h2 className={`sectionTitle ${styles.title}`}>
              A local team that turns up and finishes properly
            </h2>
            <p className={styles.copy}>
              Premium Floor Cleaning Services provides professional cleaning for
              homes, offices, commercial buildings, warehouses and industrial
              facilities across Brisbane, the Gold Coast, Ipswich, Logan and the
              Sunshine Coast. Our team uses advanced equipment and proven methods,
              and we use green, biodegradable products that are safe around
              children and pets.
            </p>
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.media}>
            <div className={styles.photo}>
              <ImageSlot
                label="Team at work"
                tone="dark"
                sizes="(min-width: 940px) 45vw, 100vw"
              />
            </div>
            <div className={styles.notes}>
              <div className={styles.note}>
                <h4 className={styles.noteTitle}>Green products</h4>
                <p className={styles.noteBody}>
                  Biodegradable, safe around children, pets and staff.
                </p>
              </div>
              <div className={styles.note}>
                <h4 className={styles.noteTitle}>Fast replies</h4>
                <p className={styles.noteBody}>
                  Under 10 minutes on average, 7am to 9pm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
