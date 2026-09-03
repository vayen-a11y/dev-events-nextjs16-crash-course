import { loadEnvConfig } from "@next/env";

// Load .env.local before importing MongoDB
loadEnvConfig(process.cwd());

const seedEvents = async () => {
    try {
        console.log("Checking environment variables...");

        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI was not found. Check your .env.local file."
            );
        }

        console.log("MONGODB_URI: Found");
        console.log("Connecting to MongoDB...");

        // Import after loading environment variables
        const { default: connectDB } = await import("../lib/mongodb");
        const { default: Event } = await import("../database/event.model");
        const { default: events } = await import("../lib/constant");

        await connectDB();

        console.log("Connected to MongoDB");
        console.log(`Seeding ${events.length} events...`);
        console.log("");

        for (const event of events) {
            const eventData = {
                title: event.title,

                slug: event.slug,

                description: event.description,

                overview: event.description,

                image: event.image,

                venue: event.location,

                location: event.location,

                date: event.date,

                time: event.time,

                mode:
                    event.location === "Online"
                        ? "online"
                        : "offline",

                audience:
                    event.category === "Conference"
                        ? "Developers, engineers, architects, and technology professionals"
                        : event.category === "Hackathon"
                            ? "Developers, designers, students, and technology enthusiasts"
                            : "Developers, engineers, and technology enthusiasts",

                agenda: [
                    "09:00 AM - 10:00 AM | Registration & Opening",
                    "10:00 AM - 11:30 AM | Keynote & Main Sessions",
                    "11:30 AM - 01:00 PM | Technical Sessions",
                    "01:00 PM - 02:00 PM | Lunch & Networking",
                    "02:00 PM - 04:00 PM | Workshops & Discussions",
                    "04:00 PM - 05:00 PM | Closing & Networking",
                ],

                organizer: `${event.title} Organizing Team`,

                tags: [
                    event.category,
                    "Technology",
                    "Developers",
                ],
            };

            const result = await Event.findOneAndUpdate(
                {
                    slug: event.slug,
                },
                {
                    $set: eventData,
                },
                {
                    upsert: true,
                    returnDocument: "after",
                    runValidators: true,
                }
            );

            console.log(`✓ ${result.title}`);
            console.log(`  slug: ${result.slug}`);
        }

        console.log("");
        console.log("=================================");
        console.log("Events seeded successfully!");
        console.log(`Total events processed: ${events.length}`);
        console.log("=================================");

        process.exit(0);
    } catch (error) {
        console.error("");
        console.error("=================================");
        console.error("Failed to seed events");
        console.error("=================================");
        console.error(error);

        process.exit(1);
    }
};

seedEvents();