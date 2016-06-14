# sample(main)
class Log {
    method log-message ($msg) {
        say $msg;
    }
}

my $log = Log.new;
$log.log-message('Be sure to drink your Ovaltine');
# end-sample
