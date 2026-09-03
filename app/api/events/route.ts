import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const runtime = "nodejs";

/* =========================================================
   GET /api/events
   ========================================================= */

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json(
            {
                message: "Events fetched successfully",
                events,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/events error:", error);

        return NextResponse.json(
            {
                message: "Event fetching failed",
                error:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            },
            { status: 500 }
        );
    }
}

/* =========================================================
   POST /api/events
   ========================================================= */

export async function POST(req: NextRequest) {
    try {
        /* -------------------------------------------------
           MongoDB
           ------------------------------------------------- */

        await connectDB();

        /* -------------------------------------------------
           Cloudinary credentials
           ------------------------------------------------- */

        const cloudinaryUrl = process.env.CLOUDINARY_URL;

        if (!cloudinaryUrl) {
            return NextResponse.json(
                {
                    message: "CLOUDINARY_URL is missing",
                },
                { status: 500 }
            );
        }

        /*
         * CLOUDINARY_URL format:
         *
         * cloudinary://API_KEY:API_SECRET@CLOUD_NAME
         */

        const match = cloudinaryUrl.match(
            /^cloudinary:\/\/([^:]+):(.+)@([^/]+)$/
        );

        if (!match) {
            return NextResponse.json(
                {
                    message:
                        "Invalid CLOUDINARY_URL format",
                },
                { status: 500 }
            );
        }

        const [, apiKey, apiSecret, cloudName] = match;

        console.log("========== CLOUDINARY CONFIG ==========");
        console.log("Cloud name:", cloudName);
        console.log("API key exists:", !!apiKey);
        console.log("API secret exists:", !!apiSecret);
        console.log("=======================================");

        /* -------------------------------------------------
           Read multipart form
           ------------------------------------------------- */

        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const overview = formData.get("overview");
        const venue = formData.get("venue");
        const location = formData.get("location");
        const date = formData.get("date");
        const time = formData.get("time");
        const mode = formData.get("mode");
        const audience = formData.get("audience");
        const agenda = formData.get("agenda");
        const organizer = formData.get("organizer");
        const tags = formData.get("tags");
        const file = formData.get("image");

        /* -------------------------------------------------
           Validate fields
           ------------------------------------------------- */

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof overview !== "string" ||
            typeof venue !== "string" ||
            typeof location !== "string" ||
            typeof date !== "string" ||
            typeof time !== "string" ||
            typeof mode !== "string" ||
            typeof audience !== "string" ||
            typeof agenda !== "string" ||
            typeof organizer !== "string" ||
            typeof tags !== "string"
        ) {
            return NextResponse.json(
                {
                    message: "Missing or invalid event fields",
                },
                { status: 400 }
            );
        }

        /* -------------------------------------------------
           Validate image
           ------------------------------------------------- */

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    message: "Image file is required",
                },
                { status: 400 }
            );
        }


        /* -------------------------------------------------
           Parse agenda
           ------------------------------------------------- */

        let parsedAgenda: string[];

        try {
            parsedAgenda = JSON.parse(agenda);

            if (
                !Array.isArray(parsedAgenda) ||
                !parsedAgenda.every(
                    (item) => typeof item === "string"
                )
            ) {
                throw new Error(
                    "Agenda must be an array of strings"
                );
            }
        } catch {
            return NextResponse.json(
                {
                    message:
                        "Invalid agenda format. Use a JSON array of strings.",
                },
                { status: 400 }
            );
        }

        /* -------------------------------------------------
           Parse tags
           ------------------------------------------------- */

        let parsedTags: string[];

        try {
            parsedTags = JSON.parse(tags);

            if (
                !Array.isArray(parsedTags) ||
                !parsedTags.every(
                    (item) => typeof item === "string"
                )
            ) {
                throw new Error(
                    "Tags must be an array of strings"
                );
            }
        } catch {
            return NextResponse.json(
                {
                    message:
                        "Invalid tags format. Use a JSON array of strings.",
                },
                { status: 400 }
            );
        }

        /* -------------------------------------------------
           Convert image to Blob
           ------------------------------------------------- */

        console.log("========== IMAGE UPLOAD ==========");
        console.log("File:", file.name);
        console.log("Size:", file.size);
        console.log("Type:", file.type);

        const arrayBuffer = await file.arrayBuffer();

        const imageBlob = new Blob([arrayBuffer], {
            type: file.type || "application/octet-stream",
        });

        /* -------------------------------------------------
           Prepare Cloudinary request
           ------------------------------------------------- */

        const cloudinaryForm = new FormData();

        cloudinaryForm.append(
            "file",
            imageBlob,
            file.name
        );

        cloudinaryForm.append(
            "folder",
            "DevEvent"
        );

        /*
         * Cloudinary server-side authentication.
         *
         * API key + API secret are sent using HTTP Basic Auth.
         */

        const basicAuth = Buffer.from(
            `${apiKey}:${apiSecret}`
        ).toString("base64");

        const cloudinaryEndpoint =
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        console.log(
            "Cloudinary endpoint:",
            cloudinaryEndpoint
        );

        console.log(
            "Uploading image directly to Cloudinary..."
        );

        /* -------------------------------------------------
           Send upload request
           ------------------------------------------------- */

        const cloudinaryResponse = await fetch(
            cloudinaryEndpoint,
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                },
                body: cloudinaryForm,
            }
        );

        /* -------------------------------------------------
           Read Cloudinary response
           ------------------------------------------------- */

        const responseText =
            await cloudinaryResponse.text();

        console.log(
            "Cloudinary HTTP status:",
            cloudinaryResponse.status
        );

        console.log(
            "Cloudinary response:",
            responseText
        );

        /* -------------------------------------------------
           Handle Cloudinary failure
           ------------------------------------------------- */

        if (!cloudinaryResponse.ok) {
            return NextResponse.json(
                {
                    message:
                        "Cloudinary image upload failed",
                    cloudinaryStatus:
                    cloudinaryResponse.status,
                    cloudinaryResponse:
                    responseText,
                },
                { status: 500 }
            );
        }

        /* -------------------------------------------------
           Parse successful response
           ------------------------------------------------- */

        let uploadResult: {
            secure_url: string;
            public_id: string;
        };

        try {
            uploadResult = JSON.parse(
                responseText
            );
        } catch {
            return NextResponse.json(
                {
                    message:
                        "Cloudinary returned invalid JSON",
                    response: responseText,
                },
                { status: 500 }
            );
        }

        if (!uploadResult.secure_url) {
            return NextResponse.json(
                {
                    message:
                        "Cloudinary did not return an image URL",
                    response: uploadResult,
                },
                { status: 500 }
            );
        }

        console.log(
            "========== CLOUDINARY SUCCESS =========="
        );

        console.log(
            "Public ID:",
            uploadResult.public_id
        );

        console.log(
            "Image URL:",
            uploadResult.secure_url
        );

        console.log(
            "========================================"
        );

        /* -------------------------------------------------
           Create event in MongoDB
           ------------------------------------------------- */

        console.log(
            "Creating event in MongoDB..."
        );

        const createdEvent = await Event.create({
            title,
            description,
            overview,
            image: uploadResult.secure_url,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            agenda: parsedAgenda,
            organizer,
            tags: parsedTags,
        });

        /* -------------------------------------------------
           Success
           ------------------------------------------------- */

        return NextResponse.json(
            {
                message: "Event created successfully",
                event: createdEvent,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "========== POST /api/events ERROR =========="
        );

        console.error("Error:", error);

        console.error(
            "Message:",
            error instanceof Error
                ? error.message
                : JSON.stringify(error)
        );

        console.error(
            "============================================"
        );

        return NextResponse.json(
            {
                message: "Event Creation Failed",
                error:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            },
            { status: 500 }
        );
    }
}