import { PrismaClient } from '@prisma/client'

import { isAdmin } from '@/utils/checker/is_admin'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { headers } = request
  const { searchParams } = new URL(request.url)

  const userId = searchParams.get('userId') ?? undefined
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 0
  
  let is_admin = false
  if (headers.get('Authorization')) {
    is_admin = await isAdmin(headers) as boolean
  }

  const query: any =  {
    orderBy: {
      id: 'desc'
    },
    where: {
      is_visible: {
        equals: true
      }
    },
    take: 15,
    skip: page * 15
  }

  if (userId) {
    query.where = {
      userId: {
        equals: userId
      },
      is_visible: {
        equals: undefined
      }
    }
  } else if (is_admin) {
    query.where = {
      is_visible: {
        equals: undefined
      }
    }
  }

  const collections = await prisma.collection.findMany(query)

  const total = await prisma.collection.count()

  return Response.json(
    {
      collections, 
      pagination: {
        total,
        page,
        total_pages: Math.ceil(total / 15)
      },
      status: 200,
      ok: true
    }
  )
}