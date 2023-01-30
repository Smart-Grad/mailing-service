import { SESv2ClientConfig, SESv2 } from "@aws-sdk/client-sesv2";

let sesInstance: SESv2;

export const getSESInstance = () => {
    if (sesInstance) return sesInstance;

    const clientConfig: SESv2ClientConfig = {
        credentials: {
            accessKeyId: process.env["AWS_ACCESS_KEY_ID"] ?? "",
            secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] ?? "",
        },
        region: process.env["AWS_REGION"],
    };

    sesInstance = new SESv2(clientConfig);

    return sesInstance;
};
