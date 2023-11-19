import { PrismaClient } from '@prisma/client'

import { RemoverDataset } from '@/utils/remover'
import { isAdmin } from '@/utils/checker/is_admin'

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

  const isImageDeleted = await RemoverDataset(collection?.file_name as string)
  if (!isImageDeleted.ok) {
    return Response.json(
      {
        status: 500,
        ok: false,
        message: isImageDeleted.message
      }
    )
  }

  await prisma.collection.delete({
    where: {
      id: parseInt(params.id)
    }
  })

  return Response.json(
    {
      message: `Image ${params.id} deleted`,
      status: 200,
      ok: true
    }
  )
}