import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

/**
 * GET /api/events/[slug]
 *
 * Fetches a single event by its slug.
 */
export async function GET(
    _req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        // Connect to the database
        await connectDB();

        // Extract slug from route parameters
        const { slug } = await params;

        // Validate slug
        if (
            !slug ||
            typeof slug !== "string" ||
            slug.trim() === ""
        ) {
            return NextResponse.json(
                {
                    message: "Invalid or missing slug parameter",
                },
                { status: 400 }
            );
        }

        // Sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase();

        // Validate slug format
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sanitizedSlug)) {
            return NextResponse.json(
                {
                    message: "Invalid slug format",
                },
                { status: 400 }
            );
        }

        // Find the event by slug
        const event = await Event.findOne({
            slug: sanitizedSlug,
        }).lean();

        // Handle event not found
        if (!event) {
            return NextResponse.json(
                {
                    message: `Event with slug '${sanitizedSlug}' not found`,
                },
                { status: 404 }
            );
        }

        // Return the event
        return NextResponse.json(
            {
                message: "Event fetched successfully",
                event,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        // Log unexpected errors on the server
        console.error("Error fetching event by slug:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}