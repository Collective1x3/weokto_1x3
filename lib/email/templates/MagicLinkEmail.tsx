import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface MagicLinkEmailProps {
  email: string
  otpCode: string
  magicLink: string
  platform: 'WEOKTO' | 'STAM'
  expiresInMinutes: number
}

export default function MagicLinkEmail({
  email,
  otpCode,
  magicLink,
  platform,
  expiresInMinutes = 15,
}: MagicLinkEmailProps) {
  const isWeokto = platform === 'WEOKTO'

  const brandColor = isWeokto ? '#B794F4' : '#3B82F6'
  const brandName = isWeokto ? 'WEOKTO' : 'STAM'

  return (
    <Html>
      <Head />
      <Preview>Votre code de connexion {brandName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>{brandName}</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Bonjour,</Text>

            <Text style={paragraph}>
              Vous avez demandé à vous connecter à votre compte {brandName} avec
              l'adresse email <strong>{email}</strong>.
            </Text>

            <Section style={otpSection}>
              <Text style={otpLabel}>Votre code de vérification :</Text>
              <Text style={{ ...otpCodeStyle, color: brandColor }}>
                {otpCode}
              </Text>
            </Section>

            <Text style={paragraph}>
              Vous pouvez également cliquer sur le lien ci-dessous pour vous
              connecter directement :
            </Text>

            <Section style={buttonSection}>
              <Link
                href={magicLink}
                style={{ ...button, backgroundColor: brandColor }}
              >
                Se connecter à {brandName}
              </Link>
            </Section>

            <Text style={infoText}>
              Ce code et ce lien sont valables pendant <strong>{expiresInMinutes} minutes</strong>.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email
              en toute sécurité.
            </Text>

            {isWeokto && (
              <Text style={footer}>
                <strong>WEOKTO</strong> - CRÉE. VENDS. DOMINE.
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0',
}

const content = {
  padding: '0 48px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '16px 0',
}

const otpSection = {
  background: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
}

const otpLabel = {
  fontSize: '14px',
  color: '#525f7f',
  margin: '0 0 8px 0',
}

const otpCodeStyle = {
  fontSize: '42px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  padding: '12px 32px',
  display: 'inline-block',
}

const infoText = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const footer = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
}
