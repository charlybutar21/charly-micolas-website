'use client';

import React from 'react';
import styles from '@/app/stock/page.module.css';

interface StockErrorBoundaryProps {
  children: React.ReactNode;
}

interface StockErrorBoundaryState {
  hasError: boolean;
}

export default class StockErrorBoundary extends React.Component<
  StockErrorBoundaryProps,
  StockErrorBoundaryState
> {
  constructor(props: StockErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): StockErrorBoundaryState {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.errorBanner} role="alert">
          <h2>Terjadi kendala saat memuat kalkulator portofolio</h2>
          <p>
            Silakan muat ulang komponen. Jika ada perubahan yang belum
            tersimpan, periksa kembali portofolio Anda setelah halaman berhasil
            dimuat.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className={styles.primaryButton}
          >
            Muat Ulang Komponen
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
