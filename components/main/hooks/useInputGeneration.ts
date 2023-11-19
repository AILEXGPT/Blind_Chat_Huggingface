import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalStorage } from 'react-use';

import { Image } from "@/utils/type"
import list_styles from "@/assets/list_styles.json"
import { useCollection } from "@/components/modal/useCollection";
import { useUser } from "@/utils/useUser";

export const useInputGeneration = () => {
  const { setOpen } = useCollection();
  const { user } = useUser(); 
  const [myGenerationsId, setGenerationsId] = useLocalStorage<any>('my-own-generations', []);

  const { data: prompt } = useQuery(["prompt"], () => {
    return ''
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: ''
  })
  const setPrompt = (str:string) => client.setQueryData(["prompt"], () => str)

  const { data: style } = useQuery(["style"], () => {
    return list_styles[0].name
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: ''
  })

  const setStyle = (str:string) => client.setQueryData(["style"], () => str)

  const client = useQueryClient()

  const { mutate: submit, isLoading: loading } = useMutation(
    ["generation"],
    async () => {
      const removeAllEmptySpace = prompt?.replace(/\s/g, '')
      if (removeAllEmptySpace === '') return null
      
      const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      if (!hasMadeFirstGeneration) setFirstGenerationDone()
      client.setQueryData(["collections"], (old: any) => {
        return {
          pagination: old?.pagination,
          images: [{
            id,
            loading: true,
            prompt
          }, ...old?.images as Image[]]
        }
      })

      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          style,
          userId: user?.sub,
        }),
      })
      const data = await response.json()

      client.setQueryData(["collections"], (old: any) => {
        const newArray = [...old?.images as Image[]]
        const index = newArray.findIndex((item: Image) => item.id === id)

        newArray[index] = !data.ok ? {
          ...newArray[index],
          error: data.message
        } : data?.image as Image

        return {
          ...old,
          images:newArray,
        }
      })

      if (!data.ok) return null

      setGenerationsId(myGenerationsId?.length ? [...myGenerationsId, data?.image?.id] : [data?.image?.id])
      setOpen(data?.image?.id)
      return data ?? {}
    }
  )

  const { data: hasMadeFirstGeneration } = useQuery(["firstGenerationDone"], () => {
    return false
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: false
  })
  const setFirstGenerationDone = () => client.setQueryData(["firstGenerationDone"], () => true)

  return {
    prompt,
    setPrompt,
    loading,
    submit,
    hasMadeFirstGeneration,
    list_styles,
    style,
    setStyle
  }

}
