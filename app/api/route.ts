import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

import list_styles from "@/assets/list_styles.json"
import { UploaderDataset } from '../../utils/uploader'
import { isTextNSFW } from '@/utils/checker/prompt'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
) {
  const global_headers = {
    Authorization: `Bearer ${process.env.HF_TOKEN}`,
    'Content-Type': 'application/json',
    ['x-use-cache']: "0"
  }

  const { inputs, style, userId } = await request.json()
  const { headers } = request

  const findStyle = list_styles.find((item) => item.name === style)

  const ip_address = headers.get("x-forwarded-for") ?? request.ip 

  // if (!headers.get('Authorization')) {
  //   const count = await prisma.collection.count({
  //     where: {
  //       ip_address,
  //       createdAt: {
  //         gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
  //       }
  //     }
  //   })
  
  //   if (count > 5) return Response.json({ status: 429, ok: false, message: "You have reached the limit of 5 images per day." });
  // }

  const textIsNSFW = await isTextNSFW(inputs, global_headers)
  if (textIsNSFW) return Response.json({ status: 401, ok: false, message: "Prompt doesn’t work, try another prompt" });

  const response = await fetch(`${process.env.API_SDXL_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      prompt: findStyle?.prompt.replace("{prompt}", inputs) ?? inputs,
      negative_prompt: findStyle?.negative_prompt ?? "",
    }),
    headers: global_headers,
  })

  
  const res = await response.clone().json().catch(() => ({}));
  if (res?.error) return Response.json({ status: response.status, ok: false, message: res.error });
  
  const base64Image = res.images[0];
  const blob = await fetch(`data:image/png;base64,${base64Image}`).then((r) => r.blob());
  
  // const imageIsNSFW = await isImageNSFW(blob, global_headers)
  // if (imageIsNSFW) return Response.json({ status: 401, ok: false, message: "Image is not safe for work." });

  const name = Date.now() + `-${inputs.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
  const { ok, message } = await UploaderDataset(blob, name)

  if (!ok) return Response.json({ status: 500, ok: false, message });

  const new_image = await prisma.collection.create({
    data: {
      prompt: inputs,
      file_name: name,
      userId: userId ?? "",
    },
  })

  return Response.json({ image: new_image, status: 200, ok: true });

}