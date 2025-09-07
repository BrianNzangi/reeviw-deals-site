// Brevo (formerly Sendinblue) API integration
const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_BASE_URL = 'https://api.brevo.com/v3'

interface BrevoContact {
  email: string
  attributes?: {
    [key: string]: string | number | boolean
  }
  listIds?: number[]
  updateEnabled?: boolean
}

interface NewsletterAttributes {
  firstName?: string
  lastName?: string
  [key: string]: string | number | boolean | undefined
}

export async function subscribeToNewsletter(email: string, attributes?: NewsletterAttributes): Promise<void> {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is not configured')
  }

  const contact: BrevoContact = {
    email,
    attributes: {
      FNAME: attributes?.firstName || '',
      LNAME: attributes?.lastName || '',
      SOURCE: 'website_newsletter',
      SUBSCRIBED_AT: new Date().toISOString(),
      ...attributes
    },
    listIds: [1], // Main newsletter list ID (configure in Brevo dashboard)
    updateEnabled: true
  }

  try {
    const response = await fetch(`${BREVO_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(contact)
    })

    if (!response.ok) {
      const error = await response.json()
      
      // If contact already exists, that's ok
      if (error.code === 'duplicate_parameter') {
        console.log('Contact already exists, updating...')
        return
      }
      
      throw new Error(`Brevo API error: ${error.message || response.statusText}`)
    }

    const result = await response.json()
    console.log('Successfully subscribed to newsletter:', result)
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    throw error
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is not configured')
  }

  try {
    const response = await fetch(`${BREVO_BASE_URL}/contacts/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        unlinkListIds: [1] // Remove from main newsletter list
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Brevo API error: ${error.message || response.statusText}`)
    }

    console.log('Successfully unsubscribed from newsletter')
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    throw error
  }
}

interface EmailParams {
  [key: string]: string | number | boolean
}

interface TransactionalEmailOptions {
  to: string[]
  subject: string
  templateId?: number
  params?: EmailParams
  htmlContent?: string
  textContent?: string
}

export async function sendTransactionalEmail(options: TransactionalEmailOptions): Promise<void> {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is not configured')
  }

  const emailData = {
    to: options.to.map(email => ({ email })),
    subject: options.subject,
    sender: {
      email: process.env.FROM_EMAIL || 'noreply@bargainly.com',
      name: 'Bargainly'
    },
    ...(options.templateId && { templateId: options.templateId }),
    ...(options.params && { params: options.params }),
    ...(options.htmlContent && { htmlContent: options.htmlContent }),
    ...(options.textContent && { textContent: options.textContent })
  }

  try {
    const response = await fetch(`${BREVO_BASE_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Brevo API error: ${error.message || response.statusText}`)
    }

    const result = await response.json()
    console.log('Successfully sent email:', result)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Template functions for common email types
export async function sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
  await sendTransactionalEmail({
    to: [email],
    subject: 'Welcome to Reeviw!',
    templateId: 1, // Configure welcome email template in Brevo
    params: {
      FNAME: firstName || 'there'
    }
  })
}

interface DealData {
  productTitle: string
  price: number
  discount: number
  url: string
  imageUrl: string
}

export async function sendDealAlert(email: string, dealData: DealData): Promise<void> {
  await sendTransactionalEmail({
    to: [email],
    subject: `🔥 Deal Alert: ${dealData.productTitle}`,
    templateId: 2, // Configure deal alert template in Brevo
    params: {
      PRODUCT_TITLE: dealData.productTitle,
      PRODUCT_PRICE: dealData.price,
      PRODUCT_DISCOUNT: dealData.discount,
      PRODUCT_URL: dealData.url,
      PRODUCT_IMAGE: dealData.imageUrl
    }
  })
}
