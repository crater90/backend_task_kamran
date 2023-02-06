# Web Sockets assignment (Basic Todo list)

### What is WebSockets ? 
WebSockets are bidirectional duplex protocols which are used in the client-server communication architecture. It is a bidirectional, communication occuring from Server to client and vice-versa. A WebSocket connection exists as long as either of the participant entities (client and server) lay it off. It enables a user to create real-time applications without having to use long polling.

Once either client or the server terminates the WebSocket connection, the other would not be able to communicate because the connection will automatically break at its end. WebSockets require help from HTTP (Hyper Text Transfer Protocol) to initialize a connection.

### Feature check
<ul>
    <li>'add' event adds new items in the list.</li>
    <li>Stores data upto 50 items in the redis cache list</li>
    <li>After 50 entries, cache is flushed and data is saved to MongoDB</li>
    <li>'/fetchAllTasks' route displays all tasks from DB as well as from cache.</li>
    <li>TypeScript support added.</li>
</ul>

## Running project locally

Install the dependencies and run on development server.

```bash
npm install 
# and
npm start
```
### Please add environment variables in .env file

DATABASE_URL = mongodb+srv://**********mongodb.net/backend-tasks <br/>
REDIS_HOST = ****** <br/>
REDIS_PORT = ***** <br/>
REDIS_PASSWORD = *****