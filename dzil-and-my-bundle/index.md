# Dist::Zilla and My Bundle

## [Dave Rolsky](http://blog.urth.org)

https://github.com/autarch/presentations  
(dzil-and-my-bundle)

------

# What is Dist::Zilla?

------

# Take a Step Back First

------

## What Is in a Perl Module?

* Code
* Docs
* META info
* Other stuff

------

From `DateTime::Format::Strptime`:

![](img/files-in-distro.png)

------

## What Goes Into a New Release?

* Update `$VERSION`
* Update Changes
* Make sure meta-info is up to date
* Include important files like `Makefile.PL`
* Include useful files like `cpanfile` or `perltidyrc`

------

## Dist::Zilla Automates Away Boilerplate

* `Makefile.PL` and other files
* Standard POD sections - `SUPPORT`, `COPYRIGHT`, etc.

------

## Dist::Zilla Standardizes All Your Releases

* I want every distro to include:
  * POD syntax tests
  * POD spelling tests
  * Compilation tests
  * Up to date dependency information
* I don't want to copy these files between distros
  * I *definitely* don't want to update 50 distros when I change how my POD syntax tests work

------

## What's in My Bundle?

* **A lot!**
* About 50 plugins

------

## What's in My Bundle?

* Generates standard tests
* Generates common files
* Determines module prereqs
* Includes useful meta-info like bug tracker, etc.
* Generates lots of POD
* Generates many author tests (kwalitee type things)

------

## What's in My Bundle?

* Runs all tests before a release
* Does some other release checks
  * Is Changes updated?
  * Do I have the newest prereqs installed
  * Are all my prereqs on CPAN?
  * Are there merge conflict markers?
  * Is this the master branch?
* Updates Changes with a release date

------

## What's in My Bundle?

* Does the release itself
* Tags release in git
* Copies generated files back to the repo
  * So contributors don't need dzil
* Commits generated files
* Bumps `$VERSION` in all modules
* Commits `$VERSION` bump
* Pushes tag and commits

------

## Integration with Pod::Weaver

* This is insane
* `Pod::Weaver` also supports bundles
* `Dist::Zilla` can be configured to invoke `Pod::Weaver`
* There is no sane way to pass config from `Dist::Zilla` to `Pod::Weaver`

------

## The Insane Way

```perl
use PadWalker qw( peek_sub );

sub configure {
    my $self = shift;
    
    my $podweaver_plugin
        = ${ peek_sub( \&Dist::Zilla::Plugin::PodWeaver::weaver )
                 ->{'$self'} };
    my $zilla = $podweaver_plugin->zilla;

    ...
    
    my $config
        = $zilla->plugin_named( $bundle_prefix
            . '/DROLSKY::WeaverConfig' );
```

------

# Questions?
