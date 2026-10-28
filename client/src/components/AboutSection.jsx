import React from 'react';

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-image">🌱</div>

      <div className="about-content">
        <span>ABOUT KISAN MARKET</span>
        <h2>Connecting Farmers With Better Opportunities</h2>
        <p>
          Kisan Market is a smart agriculture marketplace designed to connect
          farmers and buyers through a simple and transparent digital platform.
          Our mission is to eliminate unneeded middlemen and empower Indian
          agriculture with direct market access.
        </p>

        <div className="about-features">
          <div>
            <strong>01</strong>
            <span>Direct Farmer Connection & Fair Pricing</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Verified Quality Agricultural Products</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Transparent Market Information & Mandi Rates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
