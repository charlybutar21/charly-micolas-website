import type { Metadata } from 'next';
import PageIntro from '@/app/components/shared/PageIntro';
import StockWorkspace from '@/app/components/stock/StockWorkspace';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Private Stock Workspace | Charly Micolas Butarbutar',
  description:
    'Unlisted personal equity portfolio tracker, Stockbit average down simulator, and intrinsic fair value calculator.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function StockPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        eyebrow="Unlisted Workspace · IDX Equity"
        title="Portfolio &"
        emphasis="Valuation"
        note="Private equity allocation tracker, Stockbit transaction cost & average down simulator, and multi-model intrinsic fair value analyzer."
      />

      <StockWorkspace />
    </div>
  );
}
