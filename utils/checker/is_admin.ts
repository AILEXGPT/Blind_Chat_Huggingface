export const isAdmin = async (headers: Headers) => {
  return new Promise(async (resolve, reject) => {

    const Authorization = headers.get('Authorization') ?? undefined
  
    // @ts-ignore
    const HF_ADMIN = process?.env?.HF_ADMIN?.split(',') ?? []

    const userRequest = await fetch("https://huggingface.co/oauth/userinfo", {
      method: "GET",
      headers: {
        Authorization: `${Authorization}`,
      },
    })

    const user = await userRequest.clone().json().catch(() => ({}));
    const is_admin = user?.sub ? HF_ADMIN.includes(user?.sub) : false

    resolve(is_admin)
  })

}