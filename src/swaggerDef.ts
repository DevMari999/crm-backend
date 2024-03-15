const statusEnum = ['pending', 'completed', 'cancelled', 'in work', 'dubbing', 'new'] as const;
const courseTypeEnum = ['QACX', 'PCX', 'JSCX', 'JCX', 'FS', 'FE'] as const;

const swaggerDefinition: Record<string, any> = {
    openapi: '3.0.0',
    info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Local server',
        },
    ],
    components: {
        schemas: {
            Comment: {
                type: 'object',
                properties: {
                    managerId: {type: 'string'},
                    managerName: {type: 'string'},
                    comment: {type: 'string'},
                    createdAt: {type: 'string', format: 'date-time'}
                },
                required: ['comment']
            },
            Order: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    surname: {type: 'string'},
                    email: {type: 'string'},
                    phone: {type: 'string'},
                    age: {type: 'integer'},
                    course: {type: 'string'},
                    course_format: {type: 'string'},
                    course_type: {
                        type: 'string',
                        enum: courseTypeEnum
                    },
                    sum: {type: 'number'},
                    already_paid: {type: 'boolean'},
                    created_at: {type: 'string', format: 'date-time'},
                    utm: {type: 'string'},
                    msg: {type: 'string'},
                    status: {
                        type: 'string',
                        enum: statusEnum
                    },
                    group: {type: 'string'},
                    manager: {type: 'string'},
                    comments: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Comment'
                        }
                    }
                }
            },
        },
        User: {
            type: 'object',
            properties: {
                name: {type: 'string', required: true},
                lastname: {type: 'string', required: true},
                email: {type: 'string', required: true},
                password: {type: 'string'},
                isActive: {type: 'boolean', default: false},
                passwordResetToken: {type: 'string'},
                passwordResetExpires: {type: 'string', format: 'date-time'},
                role: {type: 'string', default: 'manager'},
                activationToken: {type: 'string'},
                activationTokenExpires: {type: 'string', format: 'date-time'},
                banned: {type: 'boolean', default: false},
                created_at: {type: 'string', format: 'date-time', default: 'Now'},
                last_login: {type: 'string', format: 'date-time'},
            }
        },
        RefreshToken: {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    description: 'Reference to the User this refresh token belongs to',
                },
                token: {
                    type: 'string',
                    required: true,
                    description: 'The refresh token string'
                },
                expiresAt: {
                    type: 'string',
                    format: 'date-time',
                    required: true,
                    description: 'The expiration date and time of the refresh token'
                }
            },
            required: ['user', 'token', 'expiresAt']
        },
    }

};

export default swaggerDefinition;
