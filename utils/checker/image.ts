export const isImageNSFW = async (blob: Blob, global_headers: any) => {
  return new Promise(async (resolve, reject) => {
    const headers = new Headers();
    headers.set("Content-Type", "image/*");
    const request = await fetch(`${process.env.INFERENCE_API_URL}/models/DamarJati/NSFW-Filterization-DecentScan`, {
      method: 'POST',
      headers: {
        ...global_headers,
        ...headers,
      },
      body: blob,
    })
    const res = await request.clone().json().catch(() => ({}));

    if (res?.error && res?.estimated_time) {
      setTimeout(() => {
        isImageNSFW(blob, global_headers)
      }, res?.estimated_time * 100);
    } else {
      if (res?.error) return Response.json({ status: 500, ok: false, message: res?.error });
      if (res?.length) {
        const isNSFW = res?.find((n: { label: string }) => n.label === "no_safe")?.score > 0.85 ?? false;
        resolve(isNSFW)
      }
      resolve(true)
    }
  })
}