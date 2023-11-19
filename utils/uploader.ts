import { uploadFile } from "../node_modules/@huggingface/hub/dist";
import type { RepoDesignation, Credentials } from "../node_modules/@huggingface/hub/dist";

export const UploaderDataset = async (blob: Blob, name: string) => {
  const repo: RepoDesignation = { type: "dataset", name: "enzostvs/stable-diffusion-tpu-generations" };
  const credentials: Credentials = { accessToken: process.env.HF_TOKEN as string };

  const res: any = await uploadFile({
    repo,
    credentials,
    file:
      {
        path: `images/${name}.png`,
        content: blob,
      },
  });

  if (res?.error) return {
    status: 500,
    ok: false,
    message: res?.error
  };

  return {
    status: 200,
    ok: true,
  };

}