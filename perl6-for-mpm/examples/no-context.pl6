use v6;

sub foo (--> Array:D) {
    my @foo = < a b c >;
    return @foo;
}

sub bar (--> Array:D) {
    my @bar = < key1 x key2 y >;
    return @bar;
}

my $foo = foo();
say $foo.perl;
.say for $foo.values;

my %bar = bar(); # implicitly calls %bar.STORE( bar() )
say %bar.perl;
