import { PrismaClient } from '@prisma/client'

import { isAdmin } from '@/utils/checker/is_admin'

const prisma = new PrismaClient()

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { headers } = request

  const is_admin = await isAdmin(headers)

  if (!is_admin) {
    return Response.json(
      {
        status: 401,
        ok: false,
        message: 'Wrong castle fam :/'
      }
    )
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })
  if (!collection) {
    return Response.json(
      {
        status: 404,
        ok: false
      }
    )
  }

  const new_image = await prisma.collection.update({
    where: {
      id: parseInt(params.id)
    },
    data: {
      is_visible: true
    }
  })

  return Response.json(
    {
      image: new_image,
      message: `Image ${params.id} has been updated`,
      status: 200,
      ok: true
    }
  )
}