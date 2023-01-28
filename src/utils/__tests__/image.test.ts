import { getValidImageUrl } from "../image"


test('image wil give a valid url', async () => {
  const res = getValidImageUrl('hello')
  expect(res).toBe('https://ck-cdn.annatarhe.cn/hello')

  const res2 = getValidImageUrl('/xxx.jpg')
  expect(res2).toBe('https://ck-cdn.annatarhe.cn//xxx.jpg')

  const res3 = getValidImageUrl('https://happy.chinese.new.year/rabbit.jpg')
  expect(res3).toBe('https://happy.chinese.new.year/rabbit.jpg')
})