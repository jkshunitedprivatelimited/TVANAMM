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
} from '@react-email/components';
import * as React from 'react';

interface LeadNotificationEmailProps {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  message?: string;
}

export default function LeadNotificationEmail({
  fullName = "John Doe",
  phone = "+919999999999",
  email = "john@example.com",
  city = "Hyderabad",
  message = "Interested in franchise"
}: LeadNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Franchise Lead: {fullName} from {city}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Franchise Enquiry</Heading>
          <Text style={text}>A new lead has been submitted on the T Vanamm website.</Text>
          <Hr style={hr} />
          
          <Section style={details}>
            <Text style={text}><strong>Name:</strong> {fullName}</Text>
            <Text style={text}><strong>Phone:</strong> {phone}</Text>
            <Text style={text}><strong>Email:</strong> {email}</Text>
            <Text style={text}><strong>City:</strong> {city}</Text>
            <Text style={text}><strong>Message:</strong></Text>
            <Text style={{ ...text, fontStyle: 'italic', backgroundColor: '#f9f9f9', padding: '12px' }}>
              {message || 'No additional message provided.'}
            </Text>
          </Section>
          
          <Hr style={hr} />
          <Text style={footer}>
            This is an automated message from the T Vanamm Website.
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
  border: '1px solid #eee',
  maxWidth: '600px',
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

const details = {
  margin: '20px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
