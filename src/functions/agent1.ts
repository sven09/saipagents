import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search';
import { ToolNode } from '@langchain/langgraph/prebuilt';

export async function agent1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const gcs = new GoogleCustomSearch({
      apiKey: process.env.WEBSEARCH_GOOGLE_API_KEY as string,
      googleCSEId: process.env.WEBSEARCH_GOOGLE_CSE_ID as string,
    });
    const tools = [gcs];
    const toolNode = new ToolNode(tools);
    return {
      status: 200,
      body: JSON.stringify({ message: 'Hello, world!' }),
    };
    // return {
    //   status: 200,
    //   body: JSON.stringify({ message: 'Hello, world!' }),
    // };

    // const modelConfig = await getModelConfig(MODEL_DEFAULT_PRO, GLOBAL_WORKSPACE_ID);
    // if (!modelConfig) throw new Error('Model not found');

    // const model = getLangChainModel(modelConfig, false).bindTools(tools);

    // const routeMessage = (state: typeof StateAnnotation.State) => {
    //   const { messages } = state;
    //   const lastMessage = messages[messages.length - 1] as AIMessage;
    //   // If no tools are called, we can finish (respond to the user)
    //   if (!lastMessage?.tool_calls?.length) {
    //     return END;
    //   }
    //   // Otherwise if there is, we continue and call the tools
    //   return 'tools';
    // };
    // return {
    //   status: 200,
    //   body: JSON.stringify({ message: 'Hello, world!' }),
    // };
    // const callModel = async (state: typeof StateAnnotation.State) => {
    //   const { messages } = state;
    //   const responseMessage = await model.invoke(messages);
    //   return { messages: [responseMessage] };
    // };

    // const workflow = new StateGraph(StateAnnotation)
    //   .addNode('agent', callModel)
    //   .addNode('tools', toolNode)
    //   .addEdge(START, 'agent')
    //   .addConditionalEdges('agent', routeMessage)
    //   .addEdge('tools', 'agent');

    // const app = workflow.compile({ checkpointer: checkPointsMemorySaver });

    // const humanMessage = new HumanMessage(result.data.content);
    // const inputs = { messages: [humanMessage] };

    // const newChatMessage: ChatMessage = {
    //   id: generateUniqueKey('chatMessage'),
    //   role: ChatMessageRole.human,
    //   content: result.data.content,
    //   createdAt: new Date().toISOString(),
    //   webSearch: false,
    //   threadId: threadId,
    //   modelId: modelConfig.id,
    //   lcMessages: [humanMessage],
    // };

    // return {
    //   status: 200,
    //   body: JSON.stringify({ message: 'Hello, world!' }),
    // };
    // await addMessages2Thread(thread, [newChatMessage]);

    // const thread_id = threadId;

    // const config = { configurable: { thread_id: thread_id } };

    // // Create a Node.js Readable stream
    // const stream = new Readable({
    //   async read() {
    //     try {
    //       let agentResponseChunk: AgentResponseChunk | null = null;
    //       for await (const chunk of await app.stream(inputs, {
    //         ...config,
    //         streamMode: 'updates',
    //       })) {
    //         agentResponseChunk = {
    //           type: chunk.agent
    //             ? AgentResponseChunkType.agent
    //             : chunk.tools
    //             ? AgentResponseChunkType.tool
    //             : AgentResponseChunkType.unknown,
    //           id: chunk.agent
    //             ? chunk.agent?.messages?.[0]?.id ?? generateUniqueKey('a')
    //             : chunk.tools
    //             ? chunk.tools?.messages?.[0]?.tool_call_id ?? generateUniqueKey('tool')
    //             : generateUniqueKey('unknown'),
    //           content: chunk.agent?.messages?.[0]?.content ?? chunk.tools?.messages?.[0]?.content ?? '',
    //           name: chunk.agent?.messages?.[0]?.name ? 'agent' : chunk.tools?.messages?.[0]?.name ?? '',
    //           complete: false,
    //           chunk: chunk,
    //           threadId: thread_id,
    //         };

    //         if (agentResponseChunk.content) {
    //           this.push(`${JSON.stringify({ chunk: agentResponseChunk })}\n`);
    //         }
    //       }

    //       const newChatMessage: ChatMessage = {
    //         id: generateUniqueKey('chatMessage'),
    //         role: ChatMessageRole.assistant,
    //         content: agentResponseChunk?.content ?? '',
    //         createdAt: new Date().toISOString(),
    //         webSearch: false,
    //         threadId: threadId,
    //         modelId: modelConfig.id,
    //         lcMessages: [agentResponseChunk?.chunk],
    //       };

    //       await addMessages2Thread(thread, [newChatMessage]);
    //       // Send completion signal
    //       this.push(`${JSON.stringify({ complete: true })}\n`);
    //       this.push(null);
    //     } catch (error) {
    //       console.error('Error in stream:', error);
    //       this.push(`${JSON.stringify({ error: 'An error occurred during streaming' })}\n`);
    //       this.push(null);
    //     }
    //   },
    // });
    // return {
    //   status: 200,
    //   body: stream,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Transfer-Encoding': 'chunked',
    //   },
    // } as HttpResponseInit;
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        error: `An error occurred while processing the request ${error}`,
      }),
    };
  }
}
app.setup({
  enableHttpStream: true,
});

app.http('agent1', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: agent1,
});
