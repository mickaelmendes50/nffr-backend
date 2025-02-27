import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import locales from '../locales/br.json';

dotenv.config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASS
    }
});

app.get("/send-email", async (req: Request, res: Response) => {
    const subject = 'Opaaaa SMTP com Node.js e TypeScript';
    const text = 'Olá! Esse é um teste de servidor SMTP usando Node.js e TypeScript!';
    const html = '<b>Olá!</b> Esse é um teste de servidor SMTP usando Node.js e TypeScript!';

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_USER_NAME}" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO,
            subject,
            text,
            html
        });

        res.status(200).json({ message: locales.data.SUCCESS_SEND_EMAIL, messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ error: locales.data.ERROR_SEND_EMAIL });
    }
});

app.listen(3000, () => console.log(`${locales.data.SERVER_RUNNING} 3000`));
module.exports = app;
