import nodemailer from "nodemailer"

export async function sendEmail(to, subject, text){
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "jayuxpatelx@gmail.com",
            pass: process.env.MAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `XYZ`,
        to,
        subject,
        text,
    });
}