import { Link } from 'react-router-dom'
import { COMPANY_LEGAL_NAME, PRIVACY_PATH, PRODUCT_NAME, TERMS_PATH } from '../legal/urls'

type SmsConsentNoticeProps = {
  /** When true, render the consent checkbox + required agreement copy for signup. */
  withCheckbox?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  id?: string
}

export function SmsConsentNotice({
  withCheckbox = false,
  checked = false,
  onChange,
  id = 'sms-opt-in',
}: SmsConsentNoticeProps) {
  const legalLinks = (
    <>
      <Link to={TERMS_PATH} target="_blank" rel="noreferrer">
        Terms &amp; Conditions
      </Link>{' '}
      and{' '}
      <Link to={PRIVACY_PATH} target="_blank" rel="noreferrer">
        Privacy Policy
      </Link>
    </>
  )

  if (withCheckbox) {
    return (
      <div className="legal-consent">
        <label className="checkbox" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            required
          />
          <span>
            By checking this box, you agree to our {legalLinks} and consent to receive automated SMS
            messages from {PRODUCT_NAME} ({COMPANY_LEGAL_NAME}). Message types include login
            verification codes and job/offer notices. Message frequency varies. Message and data
            rates may apply. Reply STOP to cancel, HELP for help. Consent is not a condition of
            purchase.
          </span>
        </label>
      </div>
    )
  }

  return (
    <p className="legal-consent legal-consent--inline">
      By continuing, you agree to our {legalLinks}. Continuing will send an automated login
      verification SMS from {PRODUCT_NAME} ({COMPANY_LEGAL_NAME}). Message and data rates may apply.
      Reply STOP to cancel, HELP for help.
    </p>
  )
}
