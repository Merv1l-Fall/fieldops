import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

interface EventReminderEmailProps {
  playerName: string;
  eventName: string;
  fieldName: string;
  eventDate: string;
  eventLocation: string;
  daysUntil: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const EventReminderEmail = ({
  playerName,
  eventName,
  fieldName,
  eventDate,
  eventLocation,
  daysUntil,
}: EventReminderEmailProps) => {
  const previewText = `Reminder: ${eventName} is coming up in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Row>
              <Text style={heading}>Event Reminder</Text>
            </Row>

            <Hr style={hr} />

            <Text style={paragraph}>Hi {playerName},</Text>

            <Text style={paragraph}>
              This is a reminder that you have booked a spot at{" "}
              <strong>{eventName}</strong> in {daysUntil} day{daysUntil !== 1 ? "s" : ""}!
            </Text>

            <Section style={eventDetailsBox}>
              <Text style={eventDetailsTitle}>Event Details</Text>
              <Row>
                <Text style={eventDetailLabel}>Field:</Text>
                <Text style={eventDetailValue}>{fieldName}</Text>
              </Row>
              <Row>
                <Text style={eventDetailLabel}>Location:</Text>
                <Text style={eventDetailValue}>{eventLocation}</Text>
              </Row>
              <Row>
                <Text style={eventDetailLabel}>Date & Time:</Text>
                <Text style={eventDetailValue}>{eventDate}</Text>
              </Row>
            </Section>

            <Text style={paragraph}>
              Make sure to arrive on time and bring all your gear. We look forward to
              seeing you there!
            </Text>

            <Text style={paragraph}>
              If you need to cancel your booking, please visit your dashboard.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              FieldOps — Your Airsoft Event Management Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EventReminderEmail;

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const heading = {
  color: "#1f2937",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
};

const eventDetailsBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "4px",
  padding: "16px",
  margin: "16px 0",
};

const eventDetailsTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const eventDetailLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  margin: "8px 0",
  paddingRight: "12px",
};

const eventDetailValue = {
  color: "#1f2937",
  fontSize: "14px",
  margin: "8px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "16px 0",
};
