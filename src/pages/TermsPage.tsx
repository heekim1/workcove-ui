import { Link } from 'react-router-dom'
import { COMPANY_LEGAL_NAME, PRIVACY_PATH, PRODUCT_NAME } from '../legal/urls'

export function TermsPage() {
  return (
    <article className="legal-page">
      <p className="eyebrow">Legal</p>
      <h1>Terms &amp; Conditions</h1>
      <p className="legal-page__meta">
        Effective date: October 9, 2026 · {PRODUCT_NAME} by {COMPANY_LEGAL_NAME}
      </p>

      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms &amp; Conditions (“Terms”) govern your access to and use of {PRODUCT_NAME}, a
          workforce platform operated by {COMPANY_LEGAL_NAME} (“Terarc,” “we,” “us,” or “our”). By
          creating an account, checking the SMS consent box, or using {PRODUCT_NAME}, you agree to
          these Terms and our <Link to={PRIVACY_PATH}>Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>2. Accounts</h2>
        <p>
          You must provide accurate registration information, including a valid mobile phone number
          you control. You are responsible for safeguarding your credentials and for activity under
          your account.
        </p>
      </section>

      <section>
        <h2>3. SMS / text messaging program</h2>
        <p>
          If you opt in, {PRODUCT_NAME} may send automated SMS messages to the mobile number you
          provide. Message types include account security codes (such as login verification), job
          opportunity or offer notices, and related service updates from {PRODUCT_NAME} /{' '}
          {COMPANY_LEGAL_NAME}.
        </p>
        <ul>
          <li>Message frequency varies based on your account activity and job activity.</li>
          <li>Message and data rates may apply.</li>
          <li>
            Reply <strong>STOP</strong> to opt out of Workcove SMS messages. Reply{' '}
            <strong>HELP</strong> for help.
          </li>
          <li>
            You can also manage SMS preferences by contacting us at{' '}
            <a href="mailto:support@terarc-llc.com">support@terarc-llc.com</a>.
          </li>
          <li>Consent to receive SMS is not a condition of purchasing any goods or services.</li>
        </ul>
        <p>
          Carriers are not liable for delayed or undelivered messages. We may suspend messaging if
          your number is unreachable or if required by law or carrier rules.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>
          You agree not to misuse {PRODUCT_NAME}, interfere with the service, attempt unauthorized
          access, or use the platform for unlawful employment or staffing practices.
        </p>
      </section>

      <section>
        <h2>5. Jobs and offers</h2>
        <p>
          Job listings and related information are provided for convenience. Availability, pay,
          schedule, and hiring decisions may change. {PRODUCT_NAME} does not guarantee placement or
          continued work.
        </p>
      </section>

      <section>
        <h2>6. Disclaimers</h2>
        <p>
          {PRODUCT_NAME} is provided “as is” and “as available.” To the fullest extent permitted by
          law, {COMPANY_LEGAL_NAME} disclaims warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
      </section>

      <section>
        <h2>7. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {COMPANY_LEGAL_NAME} will not be liable for
          indirect, incidental, special, consequential, or punitive damages, or any loss of profits,
          data, or goodwill arising from your use of {PRODUCT_NAME}.
        </p>
      </section>

      <section>
        <h2>8. Changes</h2>
        <p>
          We may update these Terms from time to time. The effective date above will change when we
          do. Continued use after updates constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Questions about these Terms: <a href="mailto:legal@terarc-llc.com">legal@terarc-llc.com</a>{' '}
          ·{' '}
          <a href="https://www.terarc-llc.com/" target="_blank" rel="noreferrer">
            terarc-llc.com
          </a>
        </p>
      </section>
    </article>
  )
}
