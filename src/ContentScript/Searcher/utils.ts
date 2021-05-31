export const createInput = (key: string, value: string) => {
  const newInput = document.createElement(`input`)
  newInput.setAttribute(`type`,`hidden`)
  newInput.setAttribute(`name`,key)
  newInput.setAttribute(`value`, value)
  return newInput
}

export const postFormData = (url: string, data: Record<string, string | number>[]) => {
  const form = document.createElement(`form`)
  form.setAttribute(`method`,`post`)
  form.setAttribute(`action`, url)

  for (const attribute of data) {
    const [key] = Object.keys(attribute)
    const [value] = Object.values(attribute)
    const newInput = createInput(key, `${value}`)
    form.append(newInput)
  }

  document.querySelectorAll(`body`)[0].append(form)
  form.submit()
}