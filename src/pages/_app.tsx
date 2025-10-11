import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Register service worker for PWA
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((registration) => {
                        console.log(
                            "✅ Service Worker registered successfully:",
                            registration.scope
                        );
                    })
                    .catch((error) => {
                        console.error(
                            "❌ Service Worker registration failed:",
                            error
                        );
                    });
            });
        }

        // Force landscape orientation on mobile devices
        const lockOrientation = () => {
            if (screen.orientation && (screen.orientation as any).lock) {
                (screen.orientation as any)
                    .lock("landscape")
                    .then(() => {
                        console.log(
                            "🔒 Screen orientation locked to landscape"
                        );
                    })
                    .catch((error: any) => {
                        console.log(
                            "⚠️ Screen orientation lock not supported:",
                            error
                        );
                    });
            }
        };

        // Lock orientation when the app starts
        lockOrientation();

        // Re-lock orientation on orientation change
        window.addEventListener("orientationchange", lockOrientation);

        return () => {
            window.removeEventListener("orientationchange", lockOrientation);
        };
    }, []);

    return <Component {...pageProps} />;
}

