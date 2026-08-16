import styles from './PageIntro.module.css';

interface PageIntroProps {
  number: string;
  title: string;
  emphasis?: string;
  note: string;
}

export default function PageIntro({ number, title, emphasis, note }: PageIntroProps) {
  return (
    <header className={styles.intro}>
      <p className={styles.eyebrow}>{number} / Portfolio</p>
      <div className={styles.content}>
        <h1>
          {title}
          {emphasis ? <em>{emphasis}</em> : null}
        </h1>
        <p className={styles.note}>{note}</p>
      </div>
    </header>
  );
}
