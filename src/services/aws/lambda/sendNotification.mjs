import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const snsClient = new SNSClient({ region: "us-east-1" });

const table_dynamo = process.env.table_dynamo || 'prueba';
const snsTopicArn = process.env.sns_topic_id;

export const handler = async (event, context) => {
    const now = new Date();
    const fechaHoy = now.toISOString().split("T")[0];
    const horaActual = now.toTimeString().slice(0, 5);

    const cargas = await dbClient.send(new ScanCommand({
        TableName: table_dynamo,
        FilterExpression: "#f = :fecha AND #n = :false",
        ExpressionAttributeNames: {
            "#f": "diasAntesAlerta",
            "#n": "notificado"
        },
        ExpressionAttributeValues: {
            ":fecha": fechaHoy,
            ":false": false
        }
    }));
    let list_cargas = [];
    for (const carga of cargas.Items ?? []) {
        const mensaje = `El cliente: ${carga.cliente} con N°: ${carga.numeroOrden}, esta pronto por llegar ${carga.fechaLlegada}.`;

        await snsClient.send(new PublishCommand({
            TopicArn: snsTopicArn,
            Subject: `#${carga.numeroOrden} - ${carga.cliente} llegara pronto`,
            Message: mensaje
        }));

        await dbClient.send(new UpdateCommand({
            TableName: table_dynamo,
            Key: { id: carga.id },
            UpdateExpression: "SET notificado = :val",
            ExpressionAttributeValues: { ":val": true }
        }));
        list_cargas.push(carga.numeroOrden);
    }

    return {
        statusCode: 200,
        body: {
            message: "Función ejecutada correctamente",
            numeros_cargas: list_cargas.join(", ")
        }
    };
};
