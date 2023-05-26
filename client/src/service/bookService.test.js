import { searchBooks } from "./bookService";

test("Check if the search function is working properly", async () => {
  const searchBook = await searchBooks("Eragon");
  console.log(searchBook);

  expect(searchBook[0].title).toBe("Eragon");
});
