import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import {OAuth2Client} from "google-auth-library";

dotenv.config();

const app = express();
const PORT = process.env.PORT ||5000;
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        }
    })
);

app.get("/", (req, res) => {
    res.json({
        message: "Express server is running"
    });
});

app.post("/auth/google", async (req, res) => {
    try{
        const {credential} = req.body;

        if(!credential){
            return res.status(400).json({
                message: "Google credential is missing",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if(!payload){
            return res.status(401).json({
                message: "Invalid Google credentials",
            });
        }

        if(!payload.email_verified){
            return res.status(401).json({
                message: "Email not verified by Google",
            });
        }

        req.session.user = {
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        };

        res.status(200).json({
            message: "Login successful",
            user: req.session.user,
        });
    }
    catch(err){
        console.error("Google authentication error:", err);

        res.status(401).json({
            message: "Google authentication failed",
        });
    }
});

app.get("/auth/saveduser", (req, res) => {
    if(!req.session.user){
        return res.status(200).json({
            user: null,
        });
    }

    res.status(200).json({
        user: req.session.user,
    });
});

app.post("/auth/logout", (req, res) => {
    req.session.destroy((err) =>  {
        if(err){
            console.error("Logout error:", err);

            return res.status(500).json({
                message: "Logout failed",
            });
        }

        res.clearCookie("connect.sid");
        res.status(200).json({
            message: "Logout successful",
        });
    });
});

app.get("/protected", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    res.status(200).json({
        message: "Access granted",
        user: req.session.user,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});