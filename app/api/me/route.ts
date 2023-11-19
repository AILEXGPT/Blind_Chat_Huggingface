import { cookies } from "next/headers"

export async function GET() {
  const cookie = cookies().get("auth_hf_token")

  if (!cookie) return Response.json({ status: 401, ok: false, message: "Unauthorized" });

  const request = await fetch("https://huggingface.co/oauth/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.value}`,
    },
  })

  const res = await request.clone().json().catch(() => ({}));
  // @ts-ignore
  const HF_ADMIN = process?.env?.HF_ADMIN?.split(',') ?? []
  const is_admin = res?.sub ? HF_ADMIN.includes(res?.sub) : false

  if (!res?.sub) return Response.json({ status: 401, ok: false, message: "Unauthorized" });

  return Response.json(
    {
      user: {
        ...res,
        is_admin,
      },
      status: 200,
      ok: true
    }
  )
}