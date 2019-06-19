![](img/tidy-all-the-things.jpg)

## Dave Rolsky

[https://metacpan.org/release/Code-TidyAll](https://metacpan.org<br>/release/Code-TidyAll)

------

## What is Code::TidyAll?

Note:
A linter and prettifier for files in any language, from JS to Perl to JSON.

------

## Created by Jon Swartz

------

## Why Code::TidyAll?

Note:
My OCD

------

## Plugin- and Config-Based

Note:
Entirely driven by config, which specifies which plugins to use and what files
each plugin applies to.

------

```
ignore = DateTime-*/**/*
...

[PerlCritic]
select = **/*.{pl,pm,t,psgi}
argv = --profile=$ROOT/perlcriticrc

[PerlTidy]
select = **/*.{pl,pm,t,psgi}
argv = --profile=$ROOT/perltidyrc

[SortLines::Naturally]
select = .stopwords

[Test::Vars]
select = **/*.pm
```

------

```
global_options = ...
global_options = ...

[SomePlugin]
plugin_options = ...

[SomePlugin another config]
plugin_options = ...

[DifferentPlugin]
...
```

------

```
$> tidyall -a -j 8
```

------

## Caching Results

Note:
TidyAll caches results by default, and only re-runs checks when the file
changes. You can force a run if you want.

------

## Testing Tidyness

```perl
use Test::Code::TidyAll;
use Test::More;

tidyall_ok();

done_testing();
```

------

## Caching Strategies

Note:
Caching strategies are also pluggable. In particular, you can set up caching
to be shared between branches for CI systems.

------

## Many CLI Options

Note:
File selection options. Caching options. Verbosity, etc.

------

## File Selection Options

* `tidyall -a`
* `tidyall -g`
* `tidyall -r ./path`
* `tidyall ./just/One/File.pm`

Note:
* All
* Git added/modified
* Recursive

------

## Parallel Jobs

* `tidyall -j N`

------

## Disable Caching

* `tidyall --no-cache`

------

## Git Hooks

```
#!/usr/bin/env perl
use strict;
use warnings;

use Code::TidyAll::Git::Precommit;
Code::TidyAll::Git::Precommit->check();
```

in `.git/hooks/pre-commit`

------

# Plugin Classes

Note:
* Can also write new plugin classes to provide new tidiers & linters. This a
  bit faster if the new thing is in Perl and you don't need to fork a process,
  especially when working on many files.

------

# Generic Transformer / Validator

Note:
* Allows you to add new tidiers & linters by specifying the executable, the
  flags to pass, and the exit codes to expect.

------

## Available Plugins

Note:

PerlTidy, Perl Critic, JSON, JS Hint & Lint, Pod files, Line sorting, gofmt
and go vet. Fairly easy to write more.

------

# Precious 💍

One code quality tool to rule them all

https://github.com/houseabsolute/precious-rs

Note:
* My new tidyall replacement
* Why write this?
* Wanted to learn Rust
* Tidyall does not play well with Go - operates on files but Go packages are
  directories. Very hard to fix this in tidyall.

------

## Questions?
