import { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { getSESInstance } from "../config";

const ResuestBodySchema = z.object({
    otp: z.string(),
    recipient: z.string(),
});

const sendOtp = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== "POST") {
        return res.status(400).json({
            success: false,
            error: "Invalid Request Method",
        });
    }

    try {
        const requestBodyValidationResult = ResuestBodySchema.safeParse(
            req.body
        );

        if (!requestBodyValidationResult.success) {
            return res.status(400).json({
                success: false,
                error: requestBodyValidationResult.error.errors[0].message,
            });
        }

        const requestPayload = requestBodyValidationResult.data;

        const sesClient = getSESInstance();

        const emailSendingResponse = await sesClient.sendEmail({
            FromEmailAddress: process.env["SENDER_EMAIL_ADDRESS"] ?? "",
            Destination: {
                ToAddresses: [requestPayload.recipient],
            },
            Content: {
                Simple: {
                    Subject: {
                        Charset: "utf-8",
                        Data: "Verify Your Email",
                    },
                    Body: {
                        Html: {
                            Charset: "utf-8",
                            Data: `<h1>Your Verfication code is: ${requestPayload.otp}</h1>`,
                        },
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                messageId: emailSendingResponse.MessageId,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!",
        });
    }
};

export default sendOtp;
