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
          {/*
            Was "Need professional cleaning services?" over a single run-on
            sentence. Both read as domestic and neither said what the business
            actually specialises in — this leads on the floor, names the sites, and
            keeps the sentence short enough to be read at a glance.
          */}
          <p className={styles.kicker}>Commercial sites and homes</p>
          <h2 className={styles.title}>
            Worn, dull or dirty floors don’t always need replacing. Let us look at
            yours first.
          </h2>
          <div className={styles.actions}>
            <a href="#contact" className={styles.book}>
              Get a free assessment
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
            alt="Premium Floor Cleaning Services team member holding a duster, cloth and cleaning caddy"
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
