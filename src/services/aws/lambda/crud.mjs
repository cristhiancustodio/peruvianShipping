
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    UpdateCommand,
    PutCommand,
    DynamoDBDocumentClient,
    ScanCommand,
    DeleteCommand,
    GetCommand
} from "@aws-sdk/lib-dynamodb";


import { randomUUID } from 'crypto';


const table_dynamo = process.env.table_dynamo || 'prueba';
const region = process.env.region || 'us-east-1';


const clientDynamo = new DynamoDBClient({ region: region });
const docClient = DynamoDBDocumentClient.from(clientDynamo);
const TABLE_NAME = table_dynamo;

export const handler = async (event, context) => {
    try {

        const method = event.requestContext.http.method;
        const id = event?.pathParameters?.id;
        const body = event?.body ?? "";

        let response;

        switch (method) {
            case 'POST':
                response = await insertRegister(JSON.parse(body));
                break;
            case 'GET':
                response = id ? await getItem(id) : await getAllItems();
                break;
            case 'PUT':
                response = await updateItem(id, JSON.parse(body));
                break;
            case 'DELETE':
                response = await deleteItem(id);
                break;
            default:
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Invalid request type",
                        event: event,
                        context: context,
                    }),
                };
        }

        return response;

    } catch (error) {

        return {
            //body: JSON.stringify({
            message: 'Internal Server Error',
            error: error.message
            //}),
        };
    }

};

const insertRegister = async (data) => {
    try {
        
        const id = randomUUID();
        const paramsDB = {
            TableName: TABLE_NAME,
            Item: {
                id: id,
                ...data,
                fechaCreacion: new Date().toISOString()
            }
        };
        const commandDB = new PutCommand(paramsDB);
        const res = await docClient.send(commandDB);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Registro insertado correctamente',
                data: res
            }),
        }
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: 'Item already exists' })
            };
        }
        throw error;
    }
}


// Función principal del handler

// READ - Obtener un item por ID
async function getItem(id) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Item not found' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Item retrieved successfully',
            item: result.Item
        })
    };
}

// READ - Obtener todos los items
async function getAllItems() {

    const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 100
    });

    const response = await docClient.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(response.Items),
    };
}

// UPDATE - Actualizar un item
async function updateItem(id, updates) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'ID is required' })
        };
    }

    // Verificar que el item existe primero
    const getCommand = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
    });

    const existingItem = await docClient.send(getCommand);

    if (!existingItem.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Item not found' })
        };
    }

    // Preparar la expresión de actualización
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Agregar updatedAt automáticamente
    updates.updatedAt = new Date().toISOString();

    Object.keys(updates).forEach((key, index) => {
        if (key !== 'id') { // No actualizar el ID
            updateExpressions.push(`#attr${index} = :val${index}`);
            expressionAttributeNames[`#attr${index}`] = key;
            expressionAttributeValues[`:val${index}`] = updates[key];
        }
    });

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Item updated successfully',
            item: result.Attributes
        })
    };
}

// DELETE - Eliminar un item
async function deleteItem(id) {
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'ID is required' })
        };
    }
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
        ReturnValues: 'ALL_OLD'
    });

    const result = await docClient.send(command);

    if (!result.Attributes) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Item not found' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Item deleted successfully',
            deletedItem: result.Attributes
        })
    };
}

