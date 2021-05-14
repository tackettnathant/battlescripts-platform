# battlescripts-platform

#### Player

```
{
  id: Number,
  game: Number,      // game id
  name: String,
  avatar: String,
  description: String,
  author: Number,    // user id
  author_name: String,
  language: "javascript",
  code: String,
  published: Boolean,
  
  version: String,   // semver
  created_on: DateTime,
  updated_on: DateTime,
}
```

#### Game

```
{
  id: Number,
  name: String,
  description: String,   // md
  documentation: String, // md
  reference: String,     // md
  author: Number,        // user id
  author_name: String,
  language: "javascript",
  code: String,
  published: Boolean,
  logo: String,          // s3 arn
  banner: String,        // s3 arn
  
  version: String,       // semver
  created_on: DateTime,
  updated_on: DateTime
}
```

#### Renderer

```
{
  id: Number,
  game: Number,          // game id
  name: String,
  description: String,
  author: Number,        // user id
  author_name: String,
  content_type: "text/html",
  js: String,
  library: "react|vue",
  css: String,
  html: String,
  sprite: String,        // s3 arn
  
  version: String,       // semver
  created_on: DateTime,
  updated_on: DateTime
}
```

#### User

```
{
  id: Number,
  name: String,
  nickname: String,
  
  twitter: String,
  facebook: String,
  github: String,
}
```
