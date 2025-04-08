const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');

exports.options = {
    "components": {
        "schemas": {
            User: m2s(User)
        },
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "format": "JWT"
            }
        }
    },
    "security": [
        {
            "BearerAuth": []
        }
    ],
    "openapi": "3.1.0",
    "info": {
        "title": "Users and Products CRUD API",
        "version": "1.0.0",
        "description": "An application for creating users and choosing products",
        "contact": {
            "name": "API Support",
            "url": "https://aueb.gr/support",
            "email": "support@example.com"
        }
    },
    "servers": [
        {
            "url": "http://localhost:3000",
            "description": "Local server"
        },
        {
            "url": "https://api.example.com",
            "description": "Development server"
        }
    ],
    "tags": [
        {
            "name": "Users",
            "description": "Endpoints for users"
        },
        {
            "name": "Users and Products",
            "description": "Endpoints for users and products"
        },
        {
            "name": "Auth",
            "description": "Endpoints for Authentication"
        }
    ],
    "paths": {
        "/api/users": {
            "get": {
            "tags": ["Users"],
            "description": "Returns a list of all users",
                "responses": {
                    "200": {
                        "description": "List of all users",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/User"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": ["Users"],
                "description": "Create a new user",
                "requestBody": {
                    "description": "JSON object containing user data",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": {
                                        "type": "string",
                                    },
                                    "password": {
                                        "type": "string",
                                    },
                                    "name": {
                                        "type": "string",
                                    },
                                    "surname": {
                                        "type": "string",
                                    },
                                    "email": {
                                        "type": "string",
                                        "format": "email",
                                    },
                                    "address": {
                                        "type": "object",
                                        "properties": {
                                            "area": { "type": "string" },
                                            "road": { "type": "string" },
                                        }
                                    },
                                    "phone": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "type": {
                                                    "type": "string"},
                                                "number": {
                                                    "type": "number"},
                                            }
                                        }
                                    }
                                },
                                "required": ["username", "password", "name", "surname", "email"],
                            }
                        }
                    },
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/User"
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "User created successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid input data"
                    }
                }
            }
        },
        "/api/users/{username}": {
            "get": {
                "tags": ["Users"],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of the user to find",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "description": "Returns a single user by username",
                "responses": {
                    "200": {
                        "description": "User found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            },
            "patch": {
                "tags": ["Users"],
                "description": "Update a user by username",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of the user to update",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "description": "JSON object containing updated user data",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": {
                                        "type": "string",
                                    },
                                    "name": {
                                        "type": "string",
                                    },
                                    "surname": {
                                        "type": "string",
                                    },
                                    "email": {
                                        "type": "string",
                                        "format": "email",
                                    },
                                    "address": {
                                        "type": "object",
                                        "properties": {
                                            "area": { "type": "string" },
                                            "road": { "type": "string" },
                                        }
                                    },
                                    "phone": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "type": {
                                                    "type": "string"},
                                                "number": {
                                                    "type": "number"}
                                            }
                                        }
                                    }
                                },
                                "required": ["email"],
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "User updated successfully",
                        "content": {
                            "application/json": {
                                "$ref": "#/components/schemas/User"
                            }
                        }
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            },
            "delete": {
                "tags": ["Users"],
                "description": "Delete a user by username",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of the user to delete",
                        "type": "string"
                    }
                ],
                "responses": {
                    "204": {
                        "description": "User deleted successfully"
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            }
        },
        "/api/auth/login": {
            "post": {
                "tags": ["Auth"],
                "description": "Login user",
                "requestBody": {
                    "description": "User login credentials resulting in jwt token",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": {
                                        "type": "string"
                                    },
                                    "password": {
                                        "type": "string"
                                    }
                                },
                                "required": ["username", "password"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "User logged in successfully/Token Returned",
                        "content": {
                            "application/json": {
                                "schema": {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Invalid username or password"
                    }
                }
            }
        },
        "/api/user-product/{username}": {
            "get": {
                "tags": ["Users and Products"],
                "description": "Returns a list of products for a user",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of the user to find products for",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of products for the user",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": 'array',
                                    "items": { "$ref": '#/components/schemas/User' }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": 'User not found'
                    }
                }
            }
        }
    }
}
