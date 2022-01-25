// retruned by action functions (fine-grained server-side results)
type ActionResult<state, resBody> = [status: number, state: state, resData: resBody | undefined];

// returned by Remix actions (boiled-down results for UI)
interface ActionData {
  error?: string;
  ok?: boolean;
}

export type { ActionResult, ActionData };
