export async function getData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('an error happen!')
    }
    const data = await response.json()
    return data
  } catch (err) {
    console.error('ay caramba')
  }
} 