import { Link } from 'react-router-dom'
import {
  COMPANY_ADDRESS,
  COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
  TERMS_PATH,
} from '../legal/urls'

export function PrivacyPage() {
  return (
    <article className="legal-page">
      <p className="eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p className="legal-page__meta">
        Effective date: October 9, 2026 · {PRODUCT_NAME} by {COMPANY_LEGAL_NAME}
      </p>

      <section>
        <h2>1. Overview</h2>
        <p>
          This Privacy Policy explains how {COMPANY_LEGAL_NAME} (“Terarc,” “we,” “us,” or “our”)
          collects, uses, and shares information when you use {PRODUCT_NAME}. By using the service,
          you agree to this Policy and our <Link to={TERMS_PATH}>Terms &amp; Conditions</Link>.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> email address, mobile phone number, role (for example,
            worker), and authentication-related records.
          </li>
          <li>
            <strong>SMS consent records:</strong> whether you opted in to text messages, when you
            opted in, related IP address (when available), and terms version.
          </li>
          <li>
            <strong>Usage data:</strong> job browsing and offer activity within {PRODUCT_NAME}, plus
            basic device/log information needed to operate and secure the service.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>Create and secure your account, including SMS login verification codes.</li>
          <li>Show job openings and process job offer submissions.</li>
          <li>
            Send opted-in SMS messages for security codes, job/offer notices, and related service
            communications.
          </li>
          <li>Comply with law, prevent abuse, and improve reliability of the platform.</li>
        </ul>
      </section>

      <section>
        <h2>4. SMS / text messaging</h2>
        <p>
          If you consent, we use your phone number to send automated texts described in our{' '}
          <Link to={TERMS_PATH}>Terms &amp; Conditions</Link>. Message frequency varies. Message and
          data rates may apply. Reply <strong>STOP</strong> to opt out or <strong>HELP</strong> for
          help. Opting out of SMS may limit your ability to sign in if SMS verification is required.
        </p>
      </section>

      <section>
        <h2>5. Sharing</h2>
        <p>
          We share information with service providers that help us operate {PRODUCT_NAME} (for
          example, hosting, SMS delivery such as Twilio, and security tooling), and when required by
          law or to protect rights and safety. We do not sell your personal information.
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          We retain account and consent records for as long as needed to provide the service, meet
          legal obligations, resolve disputes, and enforce agreements.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use administrative, technical, and organizational measures designed to protect personal
          information. No method of transmission or storage is completely secure.
        </p>
      </section>

      <section>
        <h2>8. Your choices</h2>
        <ul>
          <li>Update account details by contacting support.</li>
          <li>Opt out of SMS by replying STOP or emailing support.</li>
          <li>Request access or deletion where applicable law provides those rights.</li>
        </ul>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Privacy questions:{' '}
          <a href="mailto:sales@terarc-llc.com">sales@terarc-llc.com</a> ·{' '}
          <a href="https://www.terarc-llc.com/" target="_blank" rel="noreferrer">
            terarc-llc.com
          </a>
        </p>
        <p>
          {COMPANY_LEGAL_NAME}
          <br />
          {COMPANY_ADDRESS}
        </p>
      </section>
    </article>
  )
}
