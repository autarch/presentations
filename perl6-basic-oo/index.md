# Basic OO in Perl 6

## [Dave Rolsky](http://blog.urth.org)

https://github.com/autarch/presentations (perl6-basic-oo)

------

## Assumptions

* You're familiar with OO terminology, including:
  * class
  * object
  * attribute
  * constructor
  * method
  * inheritance
  * I'll also cover roles but I'll explain those
* You can read basic Perl 6 syntax
  * (don't worry, it's a lot like Perl 5)

------

## Perl 6 is OO to the Core

<pre><code class="lang-perl sample" sample="examples/core.pl6#main"></code></pre>

----

```none
(Int)
False
True
```

------

## Core OO

* Everything is an object
  * numbers
  * strings
  * file handles
  * arrays
  * hashes
  * (... this could go on for a while)
* Basically every built-in function is really a method
  * `length`
  * `defined`
  * hash and array lookups, and more

------

## Making a New Class

<pre><code class="lang-perl sample" sample="examples/class-1.pl6#main"></code></pre>

----

```none
(Log)
```

* We made a class!

------

## The class Keyword

* The `class` keyword declares a new class
* The body of the class goes inside curly braces
  * or you can have a `unit class` in a file
* A class is a module and can do anything a module can

------

## Class modifiers

* You can subclass a class with `is`

<pre><code class="lang-perl sample" sample="examples/class-2.pl6#main"></code></pre>

----

```none
True
True
```

------

## Constructors

* Perl 6 automatically creates a `new` method for you
  * You can override this, but you probably don't need to
* Use `BUILD` to hook into construction instead

------

## `BUILD`

* `BUILD` is called after an object is built, but before the caller sees it
* You can do things like:
  * Complex validation that doesn't fit into type constraints
  * Logging
  * Other stuff
* `BUILD` is called in every class in the hierarchy from ancestors to children
* `BUILD` can also set private attributes passed to `new`
  * (more on that later)

------

## `BUILD` Example

<pre><code class="lang-perl sample" sample="examples/class-with-build-1.pl6#main"></code></pre>

----

```none
Made a log
Log.new
```

------

## `BUILD` Arguments

* `BUILD` sees all the arguments passed to `new`

<pre><code class="lang-perl sample" sample="examples/class-with-build-2.pl6#main"></code></pre>

----

```none
Size = 42
Name = foo
```

------

## Methods

* Methods are defined with `method`

```perl
method foo { ... }
```

* Methods have access to the invocant in `self`
  * not `$self`!
* Otherwise just like a regular subroutine

------

## Method Example

<pre><code class="lang-perl sample" sample="examples/class-methods-1.pl6#main"></code></pre>

----

```none
Be sure to drink your Ovaltine
```

------

## Public and Private Methods

* By default, methods are public
* Private method names start with `!`
* Private methods are called as `self!method` instead of `self.method`

```perl
method public { ... }
method !private { ... }

self.public
self!private
```

------

## Class Methods

* You can call methods on the class instead of an object

<pre><code class="lang-perl sample" sample="examples/class-methods-2.pl6#main"></code></pre>

----

```none
Caller is object
Message 1
Caller is class
Message 2
```

------

## Methods, Submethods, and Subroutines

* A subroutine is ... a subroutine
  * No invocant
  * No inheritance
* A method is a subroutine too
  * Has an invocant, an object or class
  * Methods are inherited
* A submethod is a special method
  * Has an invocant, an object or class
  * **Not inherited**

------

## Calling Methods

```perl
# We've already seen these
$object.method($arg);
self.method($arg);
self!method($arg);

# Inside a class we can shorten those last two to:
$.method($arg);
$!method($arg);

# Perl 6 has a sane, unambiguous indirect syntax:
method $object: $arg;

# And you can write:
.method($arg); # Calls a method on $_
my @lengths = map { .length } @strings;
```

------

## Attributes

* A chunk of data owned by an object
* Declared with `has`

```perl
class Log {
    has $.level;
}
```

------

## Attribute Properties

* Required when constructing a new object or not
* Default values
* Read-write vs read-only
* Public vs private
* Optional types

------

## Accessor Methods

* Public attributes have automatic accessors

<pre><code class="lang-perl sample" sample="examples/class-attributes-5.pl6#main"></code></pre>

```none
42
1
```

------

## Required-ness

<pre><code class="lang-perl sample" sample="examples/class-attributes-1.pl6#main"></code></pre>

----

```none
42
43
The attribute '$!level' is required, but you did not provide a value for it.
  in block <unit> at ./examples/class-attributes-1.pl6 line 16
```

------

## Defaults

<pre><code class="lang-perl sample" sample="examples/class-attributes-2.pl6#main"></code></pre>

```none
42
84
```

------

## Defaults Can Be Complex

* Defaults are calculcated again for each new object

<pre><code class="lang-perl sample" sample="examples/class-attributes-3.pl6#main"></code></pre>

```none
2
84
```

------

## Read-only Versus Read-write

* By default, attributes are read-only
  * This only applies to **code that lives outside the class**
* If you are insane, you can make them read-write
  * But please remember  
    **M̟̣͍̱uta͍͎b̤̜̫l̤̘͍͎̭ẹ̟̰̦̟̻̤ s͉̲̠̮̹̱̠t̼͎̼͚̯̲ͅạ̞̯̠͍ͅt̪eͅ i̤̻̠̱̤s͇̱̫ ͍̠̜͉̘͓ț̪he̹̤̣̥̩̻ ͔r̼̪o͔̪̲͖̮̪o̫̜t ̼̠o̳͍f͉̯̬̥͚͍̼ ̥̮̥̞͈̰̣a̰̜͉͓͕̖ḽl͇̟̫ e̱̬̝̜̙̠v̫̰̲̟̙͚̯i̟̫͚̭̞l͓̥̪.̗̞**

------

## Risking One's Sanity By Engaging the Forces of Darkness

<pre><code class="lang-perl sample" sample="examples/class-attributes-4.pl6#main"></code></pre>

```none
He Comes!
Cannot modify an immutable Int
  in block <unit> at ./examples/class-attributes-4.pl6 line 10
```

------

## Private Attributes

* No accessor method is created

<pre><code class="lang-perl sample" sample="examples/class-attributes-6.pl6#main"></code></pre>

```none
42
Method 'level' not found for invocant of class 'Log'
  in block <unit> at ./examples/class-attributes-6.pl6 line 8
```

------

## Setting Private Attributes Publicly

* I want to set private attributes via the constructor!
* `$!name` in `BUILD` refers to the attribute, not an accessor

<pre><code class="lang-perl sample" sample="examples/class-attributes-7.pl6#main"></code></pre>

------

## Attributes Don't Have to be Scalars

<pre><code class="lang-perl sample" sample="examples/class-attributes-8.pl6#main"></code></pre>

```none
Hello
Anyone home?
```

------

## Attributes Can be Typed

<pre><code class="lang-perl sample" sample="examples/class-attributes-9.pl6#main"></code></pre>

```none
42
Type check failed in assignment to $!level; expected Int but got Str ("the answer")
  in block <unit> at ./examples/class-attributes-9.pl6 line 7
```

------

# Questions?

------

# Thank You

------

* roles
* method modifiers?
