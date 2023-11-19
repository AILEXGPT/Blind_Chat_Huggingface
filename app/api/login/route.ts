export async function GET() {
  const REDIRECT_URI = `https://${process.env.SPACE_HOST}/login/callback`
  return Response.json(
    {
      redirect: `https://huggingface.co/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20profile&state=STATE&response_type=code`,
      status: 200,
      ok: true
    }
  )
}