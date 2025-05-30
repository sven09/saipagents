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
