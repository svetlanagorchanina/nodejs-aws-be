import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "product-service",
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "${self:provider.environment.REGION}",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      PG_HOST: "PG_HOST",
      PG_PORT: "PG_PORT",
      PG_DATABASE: "PG_DATABASE",
      PG_USERNAME: "PG_USERNAME",
      PG_PASSWORD: "PG_PASSWORD",
      REGION: "eu-west-1",
      SNS_ARN: {
        Ref: "SNSTopic",
      },
      SNS_OK_EMAIL: "",
      SNS_ERROR_EMAIL: "",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["SQSQueue", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: [
          {
            Ref: "SNSTopic",
          },
        ],
      },
    ],
  },
  resources: {
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: "SQSQueue",
        },
      },
      SQSQueueArn: {
        Value: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
      },
    },
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSOkSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:provider.environment.SNS_OK_EMAIL}",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            status: ["OK"],
          },
        },
      },
      SNSErrorSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:provider.environment.SNS_ERROR_EMAIL}",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            status: ["ERROR"],
          },
        },
      },
    },
  },
  functions: {
    getProductsList: {
      handler: "handler.getProductsList",
      events: [
        {
          http: {
            method: "get",
            path: "products",
            cors: true,
          },
        },
      ],
    },
    getProductsById: {
      handler: "handler.getProductsById",
      events: [
        {
          http: {
            method: "get",
            path: "products/{id}",
            cors: true,
          },
        },
      ],
    },
    dbInit: {
      handler: "handler.dbInit",
    },
    createProduct: {
      handler: "handler.createProduct",
      events: [
        {
          http: {
            method: "post",
            path: "products",
            cors: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: "handler.catalogBatchProcess",
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              "Fn::GetAtt": ["SQSQueue", "Arn"],
            },
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
