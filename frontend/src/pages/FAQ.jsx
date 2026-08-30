import React from 'react';
import ContentPage, { H2 } from '../components/ContentPage';
import { FAQS, faqSchema } from '../seo/faq';

const FAQ = () => (
  <ContentPage path="/faq" schema={faqSchema}>
    <p>
      Answers to common questions about ENDURA — our physical-and-digital streetwear, the
      Digital Artifact system, The Vault, sizing and shipping across India.
    </p>
    {FAQS.map((f) => (
      <section key={f.q}>
        <H2>{f.q}</H2>
        <p>{f.a}</p>
      </section>
    ))}
  </ContentPage>
);

export default FAQ;
