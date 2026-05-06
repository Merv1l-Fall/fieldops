export interface EventReminderEmailProps {
  playerName: string;
  eventName: string;
  fieldName: string;
  eventDate: string;
  eventLocation: string;
  daysUntil: number;
}

export function getEventReminderEmailHTML({
  playerName,
  eventName,
  fieldName,
  eventDate,
  eventLocation,
  daysUntil,
}: EventReminderEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Event Reminder - ${eventName}</title>
        <style>
          body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif; line-height: 1.5; color: #374151; background: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px 0 48px; background: #ffffff; }
          .box { padding: 0 48px; }
          h1 { color: #1f2937; font-size: 32px; font-weight: bold; margin: 16px 0; }
          h2 { color: #1f2937; font-size: 24px; font-weight: bold; margin: 16px 0; }
          p { color: #374151; font-size: 16px; margin: 16px 0; }
          .hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
          .details-box { background: #f3f4f6; border-radius: 4px; padding: 16px; margin: 16px 0; }
          .detail-row { margin: 8px 0; display: flex; }
          .detail-label { color: #6b7280; font-size: 14px; font-weight: 600; padding-right: 12px; min-width: 120px; }
          .detail-value { color: #1f2937; font-size: 14px; }
          .footer { color: #9ca3af; font-size: 12px; margin: 16px 0; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          strong { font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="box">
            <h1>Event Reminder</h1>
            <hr class="hr">
            <p>Hi ${playerName},</p>
            <p>This is a reminder that you have booked a spot at <strong>${eventName}</strong> in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}!</p>
            
            <div class="details-box">
              <h2 style="margin-top: 0; font-size: 16px;">Event Details</h2>
              <div class="detail-row">
                <span class="detail-label">Field:</span>
                <span class="detail-value">${fieldName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${eventLocation}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${eventDate}</span>
              </div>
            </div>

            <p>Make sure to arrive on time and bring all your gear. We look forward to seeing you there!</p>
            <p>If you need to cancel your booking, please visit your dashboard.</p>
            <hr class="hr">
            <div class="footer">
              FieldOps — Your Airsoft Event Management Platform
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const EventReminderEmail = (props: EventReminderEmailProps) => {
  return getEventReminderEmailHTML(props);
};

export default EventReminderEmail;
