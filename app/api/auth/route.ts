export async function POST(req: Request) {
  const { code } = await req.json();

  const REDIRECT_URI = `https://${process.env.SPACE_HOST}/login/callback`;
    const Authorization = `Basic ${Buffer.from(
      `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
    ).toString("base64")}`;

    const request = await fetch("https://huggingface.co/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const response = await request
      .clone()
      .json()
      .catch(() => ({}));
  
  if (response.error) return Response.json({ status: 401, ok: false, message: response.error_description });

  return Response.json(
    {
      access_token: response.access_token,
      experes_in: response.expires_in,
      status: 200,
      ok: true
    }
  )
}