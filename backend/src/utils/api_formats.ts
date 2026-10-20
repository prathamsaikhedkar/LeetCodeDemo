class ApiResponse {
  status: number
  message: string
  data?: any

  constructor(status: number, message: string, data?: any) {
    this.status = status
    this.message = message
    this.data = data
  }
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export {
  ApiResponse,
  ApiError
}
