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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
app.get("/login", (req, res) => {
    const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=users:read&redirect_uri=${redirectUri}`;
    res.redirect(url);
});
app.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const response = yield axios_1.default.post("https://slack.com/api/oauth.v2.access", null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: redirectUri,
            },
        });
        const accessToken = response.data.access_token;
        const userInfo = yield axios_1.default.get("https://slack.com/api/users.info", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const user = userInfo.data.user;
        res.send("User authenticated");
    }
    catch (error) {
        res.status(500).send("Error during authentication");
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
