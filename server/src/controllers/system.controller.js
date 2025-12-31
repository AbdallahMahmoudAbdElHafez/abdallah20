export const shutdown = (req, res) => {
    console.log("Received shutdown request");
    res.status(200).json({ success: true, message: "جاري إغلاق السيرفر..." });

    // Give time for the response to reach the client
    setTimeout(() => {
        console.log("Shutting down server by user request...");
        process.exit(0);
    }, 2000);
};

export const restart = (req, res) => {
    console.log("Received restart request");
    res.status(200).json({ success: true, message: "جاري إعادة تشغيل السيرفر..." });

    setTimeout(() => {
        console.log("Restarting server by user request...");
        process.exit(0); // If running with PM2 or npm run dev/start as child, it should restart
    }, 1500);
};
