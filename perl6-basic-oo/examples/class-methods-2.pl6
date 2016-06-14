# sample(main)
class Log {
    method log-message ($msg) {
        say 'Caller is ' ~  ( self.defined ?? 'object' !! 'class' );
        say $msg;
    }
}

my $log = Log.new;
$log.log-message('Message 1');
Log.log-message('Message 2');
# end-sample
