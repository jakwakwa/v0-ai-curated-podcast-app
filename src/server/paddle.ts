const PADDLE_API_URL = 'https://api.paddle.com';

interface PaddleApiOptions {
  method: string;
  path: string;
  body?: object;
}

export async function paddleApiRequest({ method, path, body }: PaddleApiOptions) {
  const headers = {
    'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${PADDLE_API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Paddle API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getSubscription(subscriptionId: string) {
  return paddleApiRequest({
    method: 'GET',
    path: `/subscriptions/${subscriptionId}`,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return paddleApiRequest({
    method: 'PATCH',
    path: `/subscriptions/${subscriptionId}`,
    body: {
      status: 'canceled',
    },
  });
}

export async function updateSubscription(subscriptionId: string, updateData: any) {
  return paddleApiRequest({
    method: 'PATCH',
    path: `/subscriptions/${subscriptionId}`,
    body: updateData,
  });
}

export async function getTransaction(transactionId: string) {
  return paddleApiRequest({
    method: 'GET',
    path: `/transactions/${transactionId}`,
  });
}
