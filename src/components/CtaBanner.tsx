import ImageSlot from "./ImageSlot";
import { Phone } from "./Icons";
import { media } from "@/lib/media";
import { site } from "@/lib/site";
import styles from "./CtaBanner.module.css";

export default function CtaBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.body}>
          <p className={styles.kicker}>Need professional cleaning services?</p>
          <h2 className={styles.title}>
            Let our experienced South East QLD cleaning team restore your floors,
            carpets, windows, and surfaces with professional results.
          </h2>
          <div className={styles.actions}>
            <a href="#contact" className={styles.book}>
              Book your clean now
            </a>
            <a href={site.phone.href} className={styles.call}>
              <Phone size={19} />
              Call us: {site.phone.display}
            </a>
          </div>
        </div>

        <div className={styles.cutout}>
          {/*
            Transparent-background cut-out. `bottom center` keeps the figure
            standing on the panel's baseline so the head breaks out over the top
            edge, which is what the negative margin on .cutout is for.
          */}
          <ImageSlot
            src={media.people.cleaningGirl}
            alt="Premium Floor Cleaning team member holding a duster, cloth and cleaning caddy"
            label="Cut-out photo — transparent-background PNG of a team member, waist up, breaking out over the top edge of this panel"
            fit="contain"
            position="bottom center"
            sizes="(min-width: 940px) 420px, 80vw"
          />
        </div>
      </div>
    </section>
  );
}
