# Node.js web server in plain English

What do you mean plain English? It means there is no JavaScript. No typescript. No programming language whatsoever. Just plain English in a bunch of .txt files.

See the `text-src` directory for the source files.

The text files are "compiled" and automatically deployed to https://nie.avoguard.com/.

# Why?

I wanted to see if I could build a server without writing any code.
I wanted to see if I could build a server using only plain English instructions.

I wanted to understand how little or how much engineering skills you need to build a working web server.

# What I learned so far

No, you can't just ask "build a server". That's too vague.
The instructions have to be somewhat specific and guide the model to the proper usage. That means you need to understand the underlying libraries / frameworks to some extent.

# Try it out!

You can try out the latest build at https://nie.avoguard.com/

On every push to main, the `.txt` files are automatically built and deployed to https://nie.avoguard.com. If it doesn't work, it's probably because the generated code failed to build. Try again later.

The endpoints paths are in general unstable (see (caveats)[#caveats]), but the server should always produce a root `/` HTML page lists all the endpoints in HTML format, and a `/list` endpoint that returns a JSON object listing the endpoints (or a JSON array, depending on how it feels that build 😬).

# Endpoints (expected)

`/` - should return a HTML page saying "Hello, AI world!", along with a list of all the endpoints
`/list` - lists all the endpoints
`/quote` - generates a random quote from a list of quotes that are generated at build time
`/ping` - should return "pong"

Can't reach these endpoints? See (caveats)[#caveats].

# Endpoints (from LLMs own initiative)

These endpoints are not explicitly defined, but do frequently appear.
`/about` - returns a short description of the server, or a 404 error
`/contact` - returns a contact information, or a 404 error

# How does it work?

The server is built using OpenAI API, but could use any other language model.
The instructions for the model are written in plain English in a bunch of `.txt` files in `text-src`.

The text files are built using a node.js build script in `/index.js`, which is the only piece of human-authored source code in the project.

# Customization

You can customize the server by editing the `.txt` files in `text-src`.

If you add new files, make sure to add them to the array in `/index.js`, so they are included in the build.
The order of the files in the array is the order in which they are "built".

I'll improve this in the future.

See (How to build)[#how-to-build] for instructions on how to build the server.

# Cost?

Every build consumes about 4000 tokens of OpenAI API usage.

# Caveats

Since I'm not using stable generation of the server, every build is a surprise 😱.

With the same input, some builds might fail, some builds will succeed. It's a surprise every time! What a thrill! 🎢 You won't get that with the boring old programming languages 😂

# How to build

Supply your OpenAPI credentials in the `OPENAI_API_KEY` environmental variable or in a `.env` file.

Then run `yarn` to install build dependencies and `yarn build` to build the server.
The build will output to the `dist` directory.

# Contributing

If you come up with an interesting idea for a new endpoint, feel free to add a `.txt` file in the `text-src` directory and submit a PR.

If you want to improve the build script, feel free to submit a PR, too.

# License

MIT
