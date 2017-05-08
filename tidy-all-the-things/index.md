# Tidy All the Things

## Dave Rolsky

[https://metacpan.org/release/Code-TidyAll](https://metacpan.org<br>/release/Code-TidyAll)

------

## What is Code::TidyAll?

Note:
A linter and prettifier for files in any language, from JS to Perl to JSON.

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

## Available Plugins

Note:

PerlTidy, Perl Critic, JSON, JS Hint & Lint, Pod files, Line sorting, gofmt
and go vet. Fairly easy to write more.

------

## Questions?
