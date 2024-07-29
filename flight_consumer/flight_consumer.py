import pika
import smtplib
from email.mime.text import MIMEText
import config





def send_email(subject, body, user_email):
    
    
    print(user_email)
    sender_email = config['SENDER_EMAIL']
    recipient_email = user_email
    password = config['SENDER_PASSWORD']

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient_email

    try:
        smtpserver = smtplib.SMTP("smtp.gmail.com", 587)
        smtpserver.ehlo()
        smtpserver.starttls()
        smtpserver.ehlo()
        smtpserver.login(sender_email, password)
        smtpserver.sendmail(sender_email, recipient_email, msg.as_string())
        smtpserver.close()
        print("Email sent successfully")
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTPAuthenticationError: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

def callback(ch, method, properties, body):
    #with app.app_context():
    message = body.decode()
    message = body.decode('utf-8')  # Decode from bytes to string
    try:
        # Split the message into lines
        lines = message.split('\n')
        
        # Extract the Subject
        subject = lines[0].replace('Subject: ', '').strip()
        
        # Extract the Email (last line)
        email = lines[-1].replace('Email: ', '').strip()

        # Extract the Body (all lines between the first and last line)
        body = '\n'.join(lines[1:-1]).replace('Body: ', '', 1).strip()
    
        print(subject) 
        print(email)
        print(body)
        send_email(subject, body, email)
        print(f" [x] Received and sent email: {subject}")
    except Exception as e:
        print(f"Failed to process message: {e}")

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_notifications')

channel.basic_consume(queue='flight_notifications',
                      auto_ack=True,
                      on_message_callback=callback)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
