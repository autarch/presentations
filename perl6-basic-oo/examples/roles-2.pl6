# sample(main)
role Logs {
    # This is now a required method
    method loggable-string { ... }
    method log-self { STDERR.say( self.loggable-string ) }
}
class Dog does Logs {
    method bark { say 'woof' }
}
# end-sample
