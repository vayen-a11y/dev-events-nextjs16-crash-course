import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        console.log("========== CLOUDINARY UPLOAD TEST ==========");

        const formData = await req.formData();
        const file = formData.get("image");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No image file received",
                },
                { status: 400 }
            );
        }

        console.log("File:", file.name);
        console.log("Size:", file.size);
        console.log("Type:", file.type);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<{
            secure_url: string;
            public_id: string;
        }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "DevEvent",
                },
                (error, result) => {
                    if (error) {
                        console.error(
                            "========== CLOUDINARY UPLOAD ERROR =========="
                        );
                        console.error("Message:", error.message);
                        console.error("HTTP code:", error.http_code);
                        console.error("Name:", error.name);
                        console.error(
                            "Full error:",
                            JSON.stringify(error, null, 2)
                        );
                        console.error(
                            "============================================="
                        );

                        reject(error);
                        return;
                    }

                    if (!result?.secure_url) {
                        reject(
                            new Error(
                                "Cloudinary returned no secure_url"
                            )
                        );
                        return;
                    }

                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            ).end(buffer);
        });

        console.log("Cloudinary upload successful!");
        console.log("Public ID:", result.public_id);
        console.log("URL:", result.secure_url);

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            image: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error("Cloudinary test failed:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            },
            { status: 500 }
        );
    }
}