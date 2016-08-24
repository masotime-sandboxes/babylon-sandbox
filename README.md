# babylon-sandbox
Fiddling with JSX parsing

Trying to find a way to work around Webpack's horrendous syntax for code splitting endpoints.

```
  require.ensure([], require =>
    // whatever
  , "some-pack")
```

is horribly inefficient, and because Webpack does static analysis, you can't dynamically refactor this into some function.
