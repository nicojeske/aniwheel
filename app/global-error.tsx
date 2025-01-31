"use client";

import {motion, AnimatePresence} from "framer-motion";
import {useEffect} from "react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({error}: { error: Error & { digest?: string } }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    const handleResetStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <html className="h-full">
        <body className="h-full">
        <main className="h-full bg-gradient-to-br from-slate-900 to-slate-800">
            <AnimatePresence>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.5}}
                    className="flex h-full flex-col items-center justify-center p-8 text-center"
                >
                    <div className="space-y-6">
                        {/* Error Icon */}
                        <motion.div
                            animate={{scale: [1, 1.1, 1]}}
                            transition={{repeat: Infinity, duration: 2}}
                            className="flex justify-center"
                        >
                            <ExclamationTriangleIcon className="h-20 w-20 text-rose-500"/>
                        </motion.div>

                        {/* Error Message */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white">Oops! Something went wrong</h1>
                            <p className="text-lg text-slate-400">
                                We&#39;ve encountered an unexpected error. Don&#39;t worry, our team has been notified.
                                In the meantime, you can try to reset your local data and reload the page.
                            </p>
                            {error.digest && (
                                <p className="text-sm text-slate-500">Error ID: {error.digest}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="rounded-lg bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700"
                                onClick={handleResetStorage}
                            >
                                Reset Local Data
                            </motion.button>

                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-600"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </motion.button>
                        </div>

                        {/* Support Contact */}
                        <p className="text-slate-500">
                            Need help?{" "}
                            <a
                                href="mailto:aniwheel@nicojeske.de"
                                className="text-rose-500 hover:underline"
                            >
                                Contact support
                            </a>
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
        </body>
        </html>
    );
}