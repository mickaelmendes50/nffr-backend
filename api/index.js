"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const br_json_1 = __importDefault(require("../locales/br.json"));
const archtypeData_json_1 = __importDefault(require("../data/archtypeData.json"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const cors = require('cors');
app.use(express_1.default.json());
app.use(cors());
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASS
    }
});
app.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = req.body.profile.map((value) => archtypeData_json_1.default.possibleResults[value]).join(', ');
    const html = `
        <b>Cliente:</b> ${req.body.name}<br/><b>Arquétipos:</b> ${profiles}!<br/>
        <br/>
        <b>${archtypeData_json_1.default.possibleResults[req.body.profile[0]]}:</b> ${archtypeData_json_1.default.descriptions[req.body.profile[0]]}<br/>
        <b>Palavras-chave:</b> ${archtypeData_json_1.default.keywords[req.body.profile[0]].join(', ')}<br/>
        <b>Mensagem-chave:</b> ${archtypeData_json_1.default.keyphrases[req.body.profile[0]]}<br/>
        <b>Cores:</b> ${archtypeData_json_1.default.colors[req.body.profile[0]].join(', ')}<br/>
        <br/>
        <b>${archtypeData_json_1.default.possibleResults[req.body.profile[1]]}:</b> ${archtypeData_json_1.default.descriptions[req.body.profile[1]]}<br/>
        <b>Palavras-chave:</b> ${archtypeData_json_1.default.keywords[req.body.profile[1]].join(', ')}<br/>
        <b>Mensagem-chave:</b> ${archtypeData_json_1.default.keyphrases[req.body.profile[1]]}<br/>
        <b>Cores:</b> ${archtypeData_json_1.default.colors[req.body.profile[1]].join(', ')}<br/>
        <br/>
        <b>${archtypeData_json_1.default.possibleResults[req.body.profile[2]]}:</b> ${archtypeData_json_1.default.descriptions[req.body.profile[2]]}<br/>
        <b>Palavras-chave:</b> ${archtypeData_json_1.default.keywords[req.body.profile[2]].join(', ')}<br/>
        <b>Mensagem-chave:</b> ${archtypeData_json_1.default.keyphrases[req.body.profile[2]]}<br/>
        <b>Cores:</b> ${archtypeData_json_1.default.colors[req.body.profile[2]].join(', ')}<br/>
        <br/>
        <b>Link: ${process.env.APP_BASE_URL}/resultados?archetypes=${req.body.profile[0]}&archetypes=${req.body.profile[1]}&archetypes=${req.body.profile[2]}</b>
    `;
    try {
        const info = yield transporter.sendMail({
            from: `"${process.env.SMTP_USER_NAME}" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO,
            subject: br_json_1.default.data.EMAIL_SUBJECT,
            html
        });
        console.log({ message: br_json_1.default.data.SUCCESS_SEND_EMAIL, messageId: info.messageId, mailTo: process.env.EMAIL_TO });
        res.status(200).json({ message: br_json_1.default.data.SUCCESS_SEND_EMAIL, messageId: info.messageId });
    }
    catch (error) {
        res.status(500).json({ error: br_json_1.default.data.ERROR_SEND_EMAIL });
    }
}));
app.use(express_1.default.static('static'));
app.listen(3000, () => console.log(`${br_json_1.default.data.SERVER_RUNNING} 3000`));
module.exports = app;
