import { S3, SQS } from "aws-sdk";
import * as csv from "csv-parser";
import { withCorsHeaders } from "../../../utils/withCorsHeaders";

const { REGION, BUCKET, SQS_URL } = process.env;

export const importFileParser = async function (event) {
  try {
    const s3 = new S3({ region: REGION });
    const sqs = new SQS();

    await Promise.all(
      event.Records.map(async (record) => {
        const source = record.s3.object.key;

        await logRecord(s3, sqs, source);
        await moveToParsedFolder(s3, source);
      })
    );

    return withCorsHeaders({
      statusCode: 202,
    });
  } catch (err) {
    return withCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({
        message:
          err?.message || "Something went wrong. Please try again later.",
      }),
    });
  }
};

const logRecord = (s3: S3, sqs: SQS, source: string) =>
  new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: BUCKET,
      Key: source,
    })
      .createReadStream()
      .pipe(csv())
      .on("data", (data) => {
        console.log("Data:", data);
        sendProductToQueue(sqs, data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

const sendProductToQueue = (sqs: SQS, product) => {
  sqs.sendMessage(
    {
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify(product),
    },
    (error, data) => {
      if (error) {
        console.log("SQS error:", error);
        return;
      }

      console.log("Product was sent to SQS:", data);
    }
  );
};

const moveToParsedFolder = async (s3: AWS.S3, source: string) => {
  await s3
    .copyObject({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${source}`,
      Key: source.replace("uploaded", "parsed"),
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: BUCKET,
      Key: source,
    })
    .promise();
};
