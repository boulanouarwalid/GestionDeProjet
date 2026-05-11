# Interactive API Documentation Guide

## Overview
Your Spring Boot application is now configured with **Springdoc-OpenAPI** for automatic API documentation and **Swagger UI** for an interactive interface.

## How to Access

### 1. **Swagger UI (Interactive)**
Once your application is running on `http://localhost:8080`, access the interactive API documentation at:

```
http://localhost:8080/swagger-ui.html
```

### 2. **OpenAPI JSON Specification**
The raw OpenAPI 3.0 specification is available at:

```
http://localhost:8080/api-docs
```

### 3. **OpenAPI YAML Specification**
```
http://localhost:8080/api-docs.yaml
```

## Features

### What You Get
- **Interactive API Explorer**: Test endpoints directly from the browser
- **Request/Response Examples**: See schema and sample data
- **Automatic Documentation**: Generated from your code and annotations
- **Authorization Support**: Ready for authentication (if configured)
- **Schema Validation**: Real-time validation of request bodies

### Available Endpoints

#### **Budgets** (`/api/budgets`)
- `POST /{projetId}` - Create a new budget
- `PUT /{projetId}/{budgetId}` - Update budget
- `GET /{projetId}` - Get budgets by project
- `DELETE /{budgetId}` - Delete budget

#### **Projets** (`/api/projets`)
- `GET` - Get all projects
- `GET /{id}` - Get project by ID
- `POST` - Create new project
- `DELETE /{id}` - Delete project

#### **Taches** (`/api/taches`)
- `GET` - Get all tasks
- `POST /{projetId}` - Create task for project
- `GET /projet/{projetId}` - Get tasks by project
- `PUT /{tacheId}` - Update task
- `DELETE /{tacheId}` - Delete task

#### **Depenses** (`/api/depenses`)
- `GET` - Get all expenses
- `GET /tache/{tacheId}` - Get expenses by task
- `POST /create/{tacheId}` - Create expense
- `PUT /{depenseId}` - Update expense
- `DELETE /{depenseId}` - Delete expense

## What's Included in the Configuration

### 1. **pom.xml**
Added dependency:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

### 2. **application.properties**
Configuration added:
```properties
# OpenAPI Documentation
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operations-sorter=method
springdoc.swagger-ui.tags-sorter=alpha
```

### 3. **OpenAPIConfig.java**
Created at: `src/main/java/com/controleproject/config/OpenAPIConfig.java`
- Defines API title, version, and description
- Adds contact information
- Sets license information

### 4. **Controller Annotations**
Added to all controllers:
- `@Tag` - Groups endpoints by resource
- `@Operation` - Describes endpoint functionality
- `@ApiResponse` - Documents possible responses
- `@ApiResponses` - Multiple response codes

## Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Click on any endpoint to expand it
3. Click **"Try it out"** button
4. Enter required parameters and request body
5. Click **"Execute"** to test the endpoint

### Example Request
```bash
curl -X POST "http://localhost:8080/api/budgets/1" \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 5000,
    "description": "Budget for project phase 1"
  }'
```

## Tips

- **Sort Endpoints**: Use the dropdown in Swagger UI to sort by method or alphabetically
- **Schema View**: Click on models to see request/response schema details
- **Download Spec**: Use the "Download" option to get the OpenAPI spec file
- **API Documentation**: Share the Swagger URL with frontend developers
- **OpenAPI Imports**: Import the `/api-docs` endpoint into tools like:
  - Postman
  - Insomnia
  - OpenAPI generators for client SDKs

## Next Steps

1. **Build & Run** your application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

2. **Open** `http://localhost:8080/swagger-ui.html` in your browser

3. **Test** your endpoints interactively

4. **Share** the API documentation link with team members

## Additional Configuration (Optional)

To customize further, you can modify `OpenAPIConfig.java`:
- Add server URLs
- Configure security schemes
- Add global headers
- Define common parameters

## Troubleshooting

- **Swagger UI not loading**: Check that the application is running on port 8080
- **Endpoints not showing**: Ensure all controllers have `@RestController` annotation
- **Missing responses**: Add DTOs and entity classes to improve documentation
