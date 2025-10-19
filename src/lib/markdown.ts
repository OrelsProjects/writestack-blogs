import type { Heading } from "@/types/blog";

export function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}

export const sampleMarkdown = {
  "getting-started-react": `# Getting Started with React

React is a powerful JavaScript library for building user interfaces. In this guide, we'll explore the fundamentals.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

### Key Features

React has several key features that make it popular:

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state in your application
- **Learn Once, Write Anywhere**: You can develop new features without rewriting existing code

## Setting Up Your Environment

Before you start, you'll need to set up your development environment.

### Prerequisites

Make sure you have Node.js installed on your machine. You can check by running:

\`\`\`bash
node --version
\`\`\`

### Creating Your First App

Use Create React App to set up your project:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Building Your First Component

Let's create a simple component:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

### Using Props

Props are arguments passed into React components. They are passed to components via HTML attributes.

## State Management

State allows React components to create and manage their own data.

### useState Hook

The useState Hook lets you add state to functional components:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Next Steps

Now that you understand the basics, here are some next steps:

- Learn about component lifecycle
- Explore React hooks in depth
- Build a real-world project`,

  "advanced-typescript": `# Advanced TypeScript Patterns

TypeScript adds powerful type safety to JavaScript. Let's explore advanced patterns that will level up your code.

## Generic Types

Generics provide a way to make components work with any data type while maintaining type safety.

### Basic Generics

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

### Generic Constraints

You can constrain generics to specific types:

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\`

## Utility Types

TypeScript provides several utility types for common type transformations.

### Partial and Required

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
\`\`\`

### Pick and Omit

\`\`\`typescript
type UserPreview = Pick<User, 'name' | 'email'>;
type UserWithoutAge = Omit<User, 'age'>;
\`\`\`

## Conditional Types

Conditional types help you create types based on conditions.

### Basic Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

### Distributive Conditional Types

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>;
\`\`\`

## Mapped Types

Transform properties of existing types into new types.

### Creating Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## Template Literal Types

Build new string literal types using template literal syntax.

### Basic Template Literals

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type MouseEvent = EventName<'click' | 'hover'>;
\`\`\`

## Conclusion

These advanced patterns will help you write more maintainable and type-safe code.`,

  "building-scalable-apis": `# Building Scalable APIs

Learn best practices for designing APIs that can handle growth and evolving requirements.

## API Design Principles

Good API design is crucial for long-term maintainability and scalability.

### RESTful Conventions

Follow REST principles for predictable and intuitive APIs:

- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Use plural nouns for resources
- Use proper status codes

### Versioning

Always version your APIs:

\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

## Authentication and Authorization

Security is paramount when building APIs.

### JWT Authentication

JSON Web Tokens provide a stateless authentication mechanism:

\`\`\`javascript
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
\`\`\`

### Role-Based Access Control

Implement RBAC for fine-grained permissions:

\`\`\`javascript
const checkPermission = (user, resource, action) => {
  return user.permissions.includes(\`\${resource}:\${action}\`);
};
\`\`\`

## Rate Limiting

Protect your API from abuse with rate limiting.

### Token Bucket Algorithm

Implement rate limiting using the token bucket algorithm:

\`\`\`javascript
class RateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
  }

  consume() {
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}
\`\`\`

## Caching Strategies

Implement caching to improve performance and reduce load.

### Cache Headers

Use HTTP cache headers effectively:

\`\`\`javascript
res.set({
  'Cache-Control': 'public, max-age=3600',
  'ETag': generateETag(data)
});
\`\`\`

### Redis Caching

Use Redis for distributed caching:

\`\`\`javascript
const cachedData = await redis.get(cacheKey);
if (cachedData) {
  return JSON.parse(cachedData);
}
\`\`\`

## Error Handling

Consistent error handling improves developer experience.

### Error Response Format

Standardize error responses:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": []
  }
}
\`\`\`

## Pagination

Handle large datasets efficiently with pagination.

### Cursor-Based Pagination

\`\`\`javascript
GET /api/users?cursor=abc123&limit=20
\`\`\`

### Offset-Based Pagination

\`\`\`javascript
GET /api/users?page=2&limit=20
\`\`\`

## Documentation

Good documentation is essential for API adoption.

### OpenAPI/Swagger

Use OpenAPI specification for interactive documentation.

## Monitoring and Logging

Track API performance and errors.

### Metrics to Monitor

- Response time
- Error rate
- Request volume
- Resource utilization

## Conclusion

Following these practices will help you build APIs that scale and evolve with your application.`,
};
