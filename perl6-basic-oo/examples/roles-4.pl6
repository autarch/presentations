# sample(main)
role Logs {
    # This is now a required method
    method loggable-string { ... }
    method log-self { $*ERR.say( self.loggable-string ) }
}
class Dog does Logs {
    method bark { say 'woof' }
    method loggable-string { 'The Dog Said Bow-Wow' }
}

sub log-it (Logs $thing) { $thing.log-self }

log-it( Dog.new );
my $x = 42;
log-it($x);
# end-sample
