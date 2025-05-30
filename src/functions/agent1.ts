import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { SerpAPI } from '@langchain/community/tools/serpapi';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { BaseMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { StateGraph } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';
import { END, START } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';
import { z } from 'zod';

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

export async function agent1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const gcs = new GoogleCustomSearch({
      apiKey: process.env.WEBSEARCH_GOOGLE_API_KEY as string,
      googleCSEId: process.env.WEBSEARCH_GOOGLE_CSE_ID as string,
    });
    const tools = [gcs];
    const toolNode = new ToolNode(tools);

    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      openAIApiKey: process.env.OPENAI_API_KEY_SVEN,
    });

    const boundModel = model.bindTools(tools);

    const routeMessage = (state: typeof StateAnnotation.State) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1] as AIMessage;
      // If no tools are called, we can finish (respond to the user)
      if (!lastMessage?.tool_calls?.length) {
        return END;
      }
      // Otherwise if there is, we continue and call the tools
      return 'tools';
    };

    const callModel = async (state: typeof StateAnnotation.State) => {
      // For versions of @langchain/core < 0.2.3, you must call `.stream()`
      // and aggregate the message from chunks instead of calling `.invoke()`.
      const { messages } = state;
      const responseMessage = await boundModel.invoke(messages);
      return { messages: [responseMessage] };
    };

    const workflow = new StateGraph(StateAnnotation)
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', routeMessage)
      .addEdge('tools', 'agent');

    const graph = workflow.compile();

    let inputs = {
      messages: [new HumanMessage('Wer ist deutscher Meister 2025 im Fußball? Antworte mit einem sehr langen Text.')],
    };

    for await (const chunk of await graph.stream(inputs, {
      streamMode: 'updates',
    })) {
      // console.log(chunk['messages']);
      console.log(chunk);
      console.log('\n=========================s\n');
    }
    return {
      status: 200,
      body: JSON.stringify({ message: 'Hello, world!' + toolNode.toJSON }),
    };
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
