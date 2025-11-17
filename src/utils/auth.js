// เก็บ token ใน localStorage
const TOKEN_KEY = 'didyouknow-lekchaiyawit-bro'

// บันทึก token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// อ่าน token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// ลบ token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// ตรวจสอบว่ามี token หรือไม่
export const hasToken = () => {
  return !!getToken()
}