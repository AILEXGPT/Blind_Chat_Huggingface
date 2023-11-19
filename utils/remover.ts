import { deleteFile } from "../node_modules/@huggingface/hub/dist";
import type { RepoDesignation, Credentials } from "../node_modules/@huggingface/hub/dist";

export const RemoverDataset = async (name: string) => {
  const repo: RepoDesignation = { type: "dataset", name: "enzostvs/stable-diffusion-tpu-generations" };
  const credentials: Credentials = { accessToken: process.env.HF_TOKEN as string };

  const res: any = await deleteFile({
    repo,
    credentials,
    path: `images/${name}.png`,
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