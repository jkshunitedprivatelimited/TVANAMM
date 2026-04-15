import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface UserConfirmationEmailProps {
  fullName: string;
}

export default function UserConfirmationEmail({
  fullName = "John Doe",
}: UserConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your interest in T VANAMM</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You, {fullName}</Heading>
          <Text style={text}>
            We have received your franchise enquiry. Our dedicated franchise team is reviewing your details and will get in touch with you shortly.
          </Text>
          
          <Section style={card}>
            <Text style={{...text, fontWeight: 'bold'}}>What happens next?</Text>
            <Text style={text}>
              1. Our team will call you to discuss your location and requirements.<br/>
              2. We will share the detailed ROI and investment breakdown.<br/>
              3. You&apos;ll be invited to visit our nearest outlet or headquarters.
            </Text>
          </Section>

          <Text style={text}>
            In the meantime, feel free to follow us on <Link href="https://instagram.com/T VANAMM.info" style={link}>Instagram</Link> for the latest updates.
          </Text>
          
          <Hr style={hr} />
          <Text style={footer}>
            T VANAMM | A Taste of Purity<br/>
            Hyderabad, Telangana
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  border: '1px solid #116c42',
  maxWidth: '600px',
  borderTop: '5px solid #006437'
};

const h1 = {
  color: '#006437',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 10px',
};

const card = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const link = {
  color: '#006437',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
