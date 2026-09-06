import { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let googleInitialized = false;
let activeOnSuccess = null;

export default function LoginBtn({ onSuccess }) {
    const btnRef = useRef(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        activeOnSuccess = onSuccess;

        return () => {
            activeOnSuccess = null;
        };
    }, [onSuccess]);

    useEffect(() => {
        const initializeGoogleBtn = () => {
            if (!window.google || !btnRef.current) {
                return;
            }

            if (!googleInitialized) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (resp) => {
                        if (resp.credential && activeOnSuccess) {
                            setDisabled(true);
                            try {
                                await activeOnSuccess(resp.credential);
                            }
                            finally {
                                setDisabled(false);
                            }
                        }
                    },
                });
                googleInitialized = true;
            }

            btnRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(
                btnRef.current,
                {
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    width: 320,
                }
            );
        }

        if (window.google) {
            initializeGoogleBtn();
            return;
        }



        let script = document.getElementById("google-identity-script");
        if (!script) {
            script = document.createElement("script");
            script.id = "google-identity-script";
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        script.addEventListener("load", initializeGoogleBtn);

        return () => {
            script.removeEventListener("load", initializeGoogleBtn);
        }

    }, []);

    return (
        <div
            className={`flex justify-center transition-opacity 
                ${disabled ? "pointer-events-none opacity-60" : ""}`}
            aria-disabled={disabled}
            >
            <div ref={btnRef} />
        </div>
    );
}