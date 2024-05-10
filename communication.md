# Communication

## Message Structure
Here's the structure of a message:
```ts
interface Message {
  conversationID: string
  conversationType: ConversationType
  callType: CallType
  payload: string
  sender: Sender
  sentAt: number
}
```

### conversationID
The `conversationID` is a string that uniquely identifies a conversation. A conversation is a collection of messages (request and responses). The `conversationID` helps each application identify the context of each message. It can be generated using UUIDV4.

### conversationType
The `conversationType` is of type `ConversationType` - this is an enum, containing the following values:

```ts
enum ConversationType {
  READY,
  SAVE,
  GET_TEMPLATE,
}
```

#### ConversationType
The values of the `ConversationType` enum denote the following:
- `READY`: This is a conversation surrounding the readiness of either applications. Essentially, React sends Flutter a message with `READY` and expects a `READY` in return to begin processing.
- `SAVE`: When there is a need to save the template, this conversation takes place. Now, there are two possible circumstances surrounding `SAVE`:
  - Flutter wants React to start saving, and send it back the template data: `Flutter(id, ConversationType.SAVE, CallType.REQUEST, {})` -> `React(id, ConversationType.SAVE, CallType.RESPONSE, { template })` -> `Flutter(id, ConversationType.SAVE, CallType.ACKNOWLEDGEMENT, {})`.
  - React wants Flutter to save, and sends the `SAVE` message with the template data: `React(id, ConversationType.SAVE, CallType.REQUEST, { template })` -> `Flutter(id, ConversationType.SAVE, CallType.ACKNOWLEDGEMENT, {})`.
- `GET_TEMPLATE`: When the transfer of template data is required, this conversation takes place. The communication process is similar to `ConversationType.SAVE` i.e. either React or Flutter can ask for receive the template data.

### callType
`callType` is of type enum `CallType`, defined as:

```ts
enum CallType {
  REQUEST,
  RESPONSE,
  ACKNOWLEDGEMENT,
}
```

### payload
The `payload` is a JSON-stringified object, containing conversation-specific data.

### sender
The `sender` is of type enum `Sender`, defined as:

```ts
enum Sender {
  FLUTTER,
  REACT,
}
```

### sentAt
This is a UNIX Timestamp (in milliseconds) representing the time when the message was created.

## Conversation Manager Class
The Conversation Manager class is an entity that manages conversations and messages. Its responsibilites are:
- To handle incoming messages and initiate actions based on those messages.
- To handle sending messages and awaiting responses.
- To resend messages if no responses are heard back.
- To kill a conversation if it exceeds a certain timeout.

## Communication Examples

### Getting Ready
**React** - informs Flutter that it is ready for communication.
```ts
{
  conversationID: '2e74230d-c13f-4902-a1c7-b2397498b50e',
  conversationType: ConversationType.READY,
  callType: CallType.REQUEST,
  payload: '',
  sender: Sender.REACT,
  sentAt: 1712126248534,
}
```

**Flutter** - acknowledges React's readiness.
```ts
{
  conversationID: '2e74230d-c13f-4902-a1c7-b2397498b50e',
  conversationType: ConversationType.READY,
  callType: CallType.ACKNOWLEDGEMENT,
  payload: '',
  sender: Sender.FLUTTER,
  sentAt: 1712126249269,
}
```

The Conversation Manager class on both applications now discard the conversation with the ID `2e74230d-c13f-4902-a1c7-b2397498b50e`.

There are two situations for failure here:
1. **Flutter never receives React's message for readiness**: In which case, the CM class on React resends the message again.
2. **React never receives Flutter's acknowledgement**: In which case, the CM class on React resends the message again. However, since in this scenario the conversation has already been discarded by Flutter's CM, it creates a new conversation again and sends back the acknowledgement.

### Getting The Template
**React** - informs Flutter that it requires the template.
```ts
{
  conversationID: '3d2d746b-ee85-4dae-8102-a7f0af0c5d60',
  conversationType: ConversationType.GET_TEMPLATE,
  callType: CallType.REQUEST,
  payload: '',
  sender: Sender.REACT,
  sentAt: 1712126248534,
}
```

**Flutter** - sends React the template.
```ts
{
  conversationID: '2e74230d-c13f-4902-a1c7-b2397498b50e',
  conversationType: ConversationType.GET_TEMPLATE,
  callType: CallType.RESPONSE,
  payload: '{ template, mergeTags }',
  sender: Sender.FLUTTER,
  sentAt: 1712126249269,
}
```

**React** - acknowledges Flutter's response.
```ts
{
  conversationID: '3d2d746b-ee85-4dae-8102-a7f0af0c5d60',
  conversationType: ConversationType.GET_TEMPLATE,
  callType: CallType.ACKNOWLEDGEMENT,
  payload: '',
  sender: Sender.REACT,
  sentAt: 1712126251583,
}
```

### React wants Flutter to save the template
**React** - informs Flutter that it needs to save the template.
```ts
{
  conversationID: '9166fea1-23c1-4177-9ce0-0ea40814983a',
  conversationType: ConversationType.SAVE,
  callType: CallType.REQUEST,
  payload: '{ template, mergeTags, preview }',
  sender: Sender.REACT,
  sentAt: 1712126248534,
}
```

**Flutter** - saves the template and responds with an acknowledgement.
```ts
{
  conversationID: '9166fea1-23c1-4177-9ce0-0ea40814983a',
  conversationType: ConversationType.SAVE,
  callType: CallType.ACKNOWLEDGEMENT,
  payload: '',
  sender: Sender.FLUTTER,
  sentAt: 1712126249269,
}
```

### Flutter wants React to save the template
**Flutter** - informs React that it needs to save the template.
```ts
{
  conversationID: '369d62db-f3f2-4978-b2e1-d677468a7ede',
  conversationType: ConversationType.SAVE,
  callType: CallType.REQUEST,
  payload: '',
  sender: Sender.FLUTTER,
  sentAt: 1712126248534,
}
```

**React** - saves the template and responds with the template.
```ts
{
  conversationID: '369d62db-f3f2-4978-b2e1-d677468a7ede',
  conversationType: ConversationType.SAVE,
  callType: CallType.RESPONSE,
  payload: '{ template, mergeTags, preview }',
  sender: Sender.REACT,
  sentAt: 1712126249269,
}
```

**Flutter** - saves the template and responds with an acknowledgement.
```ts
{
  conversationID: '369d62db-f3f2-4978-b2e1-d677468a7ede',
  conversationType: ConversationType.SAVE,
  callType: CallType.ACKNOWLEDGEMENT,
  payload: '',
  sender: Sender.FLUTTER,
  sentAt: 1712126259573,
}
```