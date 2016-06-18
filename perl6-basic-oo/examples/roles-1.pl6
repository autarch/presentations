# sample(main)
role Logs {
    method log (*@stuff) { .say for @stuff }
}
class Dog does Logs {
    method bark { say 'woof' }
}

my $dog = Dog.new;
$dog.log( 'foo', 'bar' );
$dog.bark
# end-sample
