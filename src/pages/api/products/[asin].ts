import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { asin } = req.query
  const apiKey = process.env.CANOPY_API_KEY

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" })
  }

  try {
    const response = await fetch(
      `https://rest.canopyapi.co/api/amazon/product?asin=${asin}&domain=US`,
      {
        method: "GET",
        headers: {
          "API-KEY": apiKey!,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch product" })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (_) {
    res.status(500).json({ error: "Internal server error" })
  }
}
