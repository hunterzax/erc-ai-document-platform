// utils/copy.ts
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true  // คัดลอกสำเร็จ
  } catch (err) {
    console.error("Failed to copy: ", err)
    return false // คัดลอกไม่สำเร็จ
  }
}
