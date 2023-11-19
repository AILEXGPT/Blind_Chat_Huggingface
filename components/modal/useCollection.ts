import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Collection, Image } from "@/utils/type"
import { useUser } from "@/utils/useUser"
import { useUpdateEffect } from "react-use"

export const useCollection = (initialId ?: string) => {
  const { user, token } = useUser()
  const [id, setId] = useState(initialId)
  const [loading, setLoading] = useState(false)

  const { data: open } = useQuery(["modal"], () => {
    return null
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: null
  })
  const setOpen = (id: string | null) => client.setQueryData(["modal"], () => id)

  const client = useQueryClient()

  const collection = useMemo(() => {
    const collections = client.getQueryData<Collection>(["collections"])
    if (!collections?.images) {
      setOpen(null)
      return null
    }
 
    return collections?.images?.find((collection) => collection.id === id)
  }, [id, loading])

  useUpdateEffect(() => setId(initialId), [initialId])

  const updateVisibility = async () => {
    setLoading(true)
    const response = await fetch(`/api/collections/${collection?.id}/visibility`, {
      method: "PUT",
      headers: {
        'Authorization': user?.sub ? token : "",
      }
    })

    const data = await response.json()
    if (data.ok) {
      client.setQueryData(["collections"], (old: any) => {
        return {
          ...old,
          images: old.images.map((collection: Image) => {
            if (collection.id === data.image.id) {
              return data.image
            }
            return collection
          })
        }
      })
    }
    setLoading(false)
  }

  const remove = async () => {
    setLoading(true)
    const response = await fetch(`/api/collections/${collection?.id}`, {
      method: "DELETE",
      headers: {
        'Authorization': user?.sub ? token : "",
      }
    })

    const data = await response.json()
    if (data.ok) {
      client.setQueryData(["collections"], (old: any) => {
        return {
          ...old,
          images: old.images.filter((col: Image) => col.id !== collection?.id)
        }
      })
      setOpen(null)
    }
    setLoading(false)
  }

  const next = () => {
    const collections = client.getQueryData<Collection>(["collections"])
    if (!collections?.images) {
      return null
    }

    const index = collections?.images?.findIndex((collection) => collection.id === id)
    if (index === -1) {
      return null
    }

    const next = collections?.images[index + 1]
    if (!next) {
      return null
    }

    setId(next.id)
  }

  const previous = () => {
    const collections = client.getQueryData<Collection>(["collections"])
    if (!collections?.images) {
      return null
    }

    const index = collections?.images?.findIndex((collection) => collection.id === id)
    if (index === -1) {
      return null
    }

    const previous = collections?.images[index - 1]
    if (!previous) {
      return null
    }

    setId(previous.id)
  }

  return {
    collection,
    open,
    setOpen,
    updateVisibility,
    remove,
    next,
    previous
  }
}