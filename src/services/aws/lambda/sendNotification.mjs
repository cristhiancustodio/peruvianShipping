import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const snsClient = new SNSClient({ region: "us-east-1" });

const table_dynamo = process.env.table_dynamo || 'prueba';
const snsTopicArn = process.env.sns_topic_id;
function formatearFecha(fechaISO) {
    // Dividir la fecha en partes usando el guión como separador
    const partes = fechaISO.split('-');

    // Verificar que la fecha tenga el formato correcto
    if (partes.length !== 3) {
        throw new Error('Formato de fecha incorrecto. Use YYYY-MM-DD');
    }

    // Reordenar las partes: día, mes, año
    const fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    return fechaFormateada;
}
export const handler = async (event, context) => {
    const now = new Date();
    //sv-SE es el código de idioma/región para Suecia (Svenska - Sweden), y se usa porque 
    //Suecia tiene un formato de fecha que coincide exactamente con lo que necesitamos:
    const limaDateTime = now.toLocaleString('sv-SE', {
        timeZone: 'America/Lima'
    });

    const [fechaHoy, horaActual] = limaDateTime.split(' ');

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

    let mensaje = "";
    for (const carga of cargas.Items ?? []) {
        mensaje += `El cliente: ${carga.cliente} con N°: ${carga.numeroOrden}, llegará el dia ${formatearFecha(carga.fechaLlegada)}.\n`;
        await dbClient.send(new UpdateCommand({
            TableName: table_dynamo,
            Key: { id: carga.id },
            UpdateExpression: "SET notificado = :val",
            ExpressionAttributeValues: { ":val": true }
        }));
        list_cargas.push(carga.numeroOrden);
    }


    await snsClient.send(new PublishCommand({
        TopicArn: snsTopicArn,
        Subject: `Tus cargas llegaran pronto`,
        Message: mensaje
    }));


    return {
        statusCode: 200,
        body: {
            message: "Función ejecutada correctamente",
            numeros_cargas: list_cargas.join(", ")
        }
    };
};
