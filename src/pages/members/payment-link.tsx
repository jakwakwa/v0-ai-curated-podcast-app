import React from 'react';
import PricingPage from '../../components/PricingPage';
import Head from 'next/head';

const PaymentLinkPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Choose Your Plan - PodSlice</title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Head>
      <PricingPage />
    </>
  );
};

export default PaymentLinkPage;
