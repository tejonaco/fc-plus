import '@violentmonkey/types'

type CSS_Selector = string

export interface Tag {
  name: string
  description: string
  color: string
}

export interface ApiCreds {
  token: string
  id?: string
}