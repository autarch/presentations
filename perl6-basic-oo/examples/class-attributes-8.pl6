# sample(main)
class Log {
    has @!messages;

    method log ($msg) { @!messages.push: $msg }
    method spew { .say for @!messages }
}

my $log = Log.new;
$log.log('Hello');
$log.log('Anyone home?');
$log.spew;
# end-sample
