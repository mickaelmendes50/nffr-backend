import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import locales from '../locales/br.json';
import archetypeData from '../data/archtypeData.json'

dotenv.config();

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASS
    }
});

app.post("/send-email", async (req: Request, res: Response) => {
    const profiles = req.body.profile.map((value: number) => archetypeData.possibleResults[value]).join(', ');
    const html = `
        <b>Cliente:</b> ${req.body.name}<br/><b>Arquétipos:</b> ${profiles}!<br/>
        <br/>
        <b>${archetypeData.possibleResults[req.body.profile[0]]}:</b> ${archetypeData.descriptions[req.body.profile[0]]}<br/>
        <b>${archetypeData.possibleResults[req.body.profile[1]]}:</b> ${archetypeData.descriptions[req.body.profile[1]]}<br/>
        <b>${archetypeData.possibleResults[req.body.profile[2]]}:</b> ${archetypeData.descriptions[req.body.profile[2]]}<br/>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_USER_NAME}" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO,
            subject: locales.data.EMAIL_SUBJECT,
            html
        });

        console.log({ message: locales.data.SUCCESS_SEND_EMAIL, messageId: info.messageId, mailTo: process.env.EMAIL_TO });
        res.status(200).json({ message: locales.data.SUCCESS_SEND_EMAIL, messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ error: locales.data.ERROR_SEND_EMAIL });
    }
});

app.listen(3000, () => console.log(`${locales.data.SERVER_RUNNING} 3000`));
module.exports = app;
