# sample(main)
multi trait_mod:<is>(Method $method, :$annoying!) {
    $method.wrap( { say "Thank you for calling {$method.name}!"; callsame } );
}

class Dog {
    method bark is annoying { say 'woof' }
}

Dog.new.bark
# end-sample
