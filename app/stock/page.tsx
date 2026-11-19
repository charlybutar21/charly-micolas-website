import type { Metadata } from 'next';
import PageIntro from '@/app/components/shared/PageIntro';
import StockDatabase from '@/app/components/stock/StockDatabase';
import StockErrorBoundary from '@/app/components/stock/StockErrorBoundary';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Stock Workspace | Charly Micolas Butarbutar',
  description:
    'Catat portofolio saham IDX, hitung estimasi nilai wajar dan Margin of Safety, serta simulasikan average down.',
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
        eyebrow="STOCK WORKSPACE / IDX · IDR"
        title="Portofolio saham"
        note="Catat posisi Anda, bandingkan harga terakhir dengan estimasi nilai wajar, dan hitung kebutuhan dana sebelum menambah lot."
      />

      <StockErrorBoundary>
        <StockDatabase />
      </StockErrorBoundary>
    </div>
  );
}
