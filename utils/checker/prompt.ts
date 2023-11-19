export const isTextNSFW = async (prompt: string, headers: any) => {
  return new Promise(async (resolve, reject) => {
    const request = await fetch(`${process.env.INFERENCE_API_URL}/models/michellejieli/NSFW_text_classifier`, {
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt,
      }),
      headers: headers,
    })
    const res = await request.clone().json().catch(() => ({}));
    const isNSFW = res?.[0]?.find((item: { label: string, score: number }) => item?.label === "NSFW")?.score > 0.73 ?? false
    resolve(isNSFW)
  })
}