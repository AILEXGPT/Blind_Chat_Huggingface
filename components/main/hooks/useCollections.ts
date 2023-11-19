import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUpdateEffect } from "react-use";
import _ from "lodash";

import { useUser } from "@/utils/useUser";

export const useCollections = (category: string) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = useUser();

  const client = useQueryClient();
  
  const {
    data,
    isFetching,
    refetch,
      } = useQuery(
    ["collections"],
    async () => {
      const queryParams = new URLSearchParams();
      if (category === 'my-own') {
        queryParams.append('userId', user?.sub);
      }
      queryParams.append('page', '0');

      const response = await fetch(`/api/collections?${queryParams.toString()}`, {
        headers: {
          ...(token ? { 'Authorization': token } : {})
        },
        method: "GET",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }
      return {
        images: data?.collections,
        pagination: data?.pagination,
      };
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,      
    }
  );

  const infiniteRefetch = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
      if (category === 'my-own') {
        queryParams.append('userId', user?.sub);
      }
      queryParams.append('page', data?.pagination?.page + 1);

      const response = await fetch(`/api/collections?${queryParams.toString()}`, {
        headers: {
          ...(token ? { 'Authorization': token } : {})
        },
        method: "GET",
      })

    const d = await response.json()
    if (d.ok) {
      const images = _.concat(data?.images, d?.collections);
      client.setQueryData(["collections"], {
        images,
        pagination: d?.pagination,
      });
    }
    setLoading(false);
  };

  useUpdateEffect(() => {
    refetch()
  }, [category]);

  return {
    images: data?.images,
    loading: isFetching,
    infiniteLoading: loading,
    infiniteRefetch,
    pagination: data?.pagination,
  }
};